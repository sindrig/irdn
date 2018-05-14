import os
import re
import argparse
import time
import datetime
import pprint

import boto3
import botocore

# We assume that we've already run make upload
REGION = 'eu-west-1'
DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(DIR, 'RESOURCE_BUCKET_NAME')) as f:
    RESOURCE_BUCKET_NAME = f.read()
CLOUDFORMATION_STACK_S3 = (
    'https://s3.amazonaws.com/%s/irdn-template.json'
) % (RESOURCE_BUCKET_NAME)
with open(os.path.join(DIR, 'STACK_NAME')) as f:
    CLOUDFORMATION_STACK_NAME = f.read()
LAMBDA_CODE_S3 = (
    RESOURCE_BUCKET_NAME, 'code.zip'
)

session = boto3.Session(profile_name='irdn')


def _get_lambda_function_name():
    cloudformation = session.client('cloudformation', region_name=REGION)
    outputs = cloudformation.describe_stacks(
        StackName=CLOUDFORMATION_STACK_NAME
    )['Stacks'][0]['Outputs']
    return [
        output['OutputValue']
        for output in outputs
        if output['OutputKey'] == 'LambdaFunctionName'
    ][0]


def update_lambda():
    '''Updates lambda code with code from S3'''
    lambda_function_name = _get_lambda_function_name()
    client = session.client('lambda', region_name=REGION)
    with open(os.path.join(DIR, 'letsencrypt', 'code.zip'), 'rb') as f:
        client.update_function_code(
            FunctionName=lambda_function_name,
            ZipFile=f.read(),
        )
    print('Lambda function %s updated' % (lambda_function_name, ))


def trigger_lambda():
    client = session.client('lambda', region_name=REGION)
    lambda_function_name = _get_lambda_function_name()
    response = client.invoke(
        FunctionName=lambda_function_name,
    )
    if response['StatusCode'] == 200:
        print('Lambda function triggered')
    else:
        print('Error triggering lambda')
        pprint.pprint(response)


def get_certificate_id(domain):
    certificate_regex = re.compile('le-(.*)-\\d+')
    client = session.client('iam')
    certificates = client.list_server_certificates(
        PathPrefix="/cloudfront/letsencrypt/"
    )
    for certificate in certificates['ServerCertificateMetadataList']:
        cert_name = certificate['ServerCertificateName']
        search = certificate_regex.search(cert_name)
        if search and search.groups() and search.groups()[0] == domain:
            return certificate['ServerCertificateId']


def update_cloudformation(template='irdn-template.json'):
    '''Updates cloudformation stack with definition in S3'''
    domain = os.getenv('DOMAIN', 'irdn.is')
    certificate_id = get_certificate_id(domain)
    starttime = datetime.datetime.utcnow()
    client = session.client('cloudformation', region_name=REGION)
    with open(os.path.join(DIR, template)) as f:
        template_body = f.read()
    stack_kwargs = dict(
        StackName=CLOUDFORMATION_STACK_NAME,
        TemplateBody=template_body,
        Capabilities=['CAPABILITY_IAM'],
        Parameters=[
            {
                'ParameterKey': 'CodeBucketName',
                'ParameterValue': RESOURCE_BUCKET_NAME
            },
            {
                'ParameterKey': 'Domain',
                'ParameterValue': domain
            },
            {
                'ParameterKey': 'CertificateId',
                'ParameterValue': certificate_id or ''
            },
        ],
    )
    try:
        stack = client.describe_stacks(StackName=CLOUDFORMATION_STACK_NAME)
        if stack['Stacks'][0]['StackStatus'] == 'ROLLBACK_COMPLETE':
            client.delete_stack(StackName=CLOUDFORMATION_STACK_NAME)
            client.create_stack(**stack_kwargs)
        else:
            client.update_stack(**stack_kwargs)
    except botocore.exceptions.ClientError as e:
        if e.args[0].endswith('does not exist'):
            client.create_stack(**stack_kwargs)
        elif e.args[0].endswith('No updates are to be performed.'):
            print('There are no updates to cloudformation stack, bailing out')
            return
        else:
            raise e
    last_status = None
    while True:
        stacks = client.describe_stacks(
            StackName=CLOUDFORMATION_STACK_NAME
        )
        status = stacks['Stacks'][0]['StackStatus']
        if status != last_status:
            print(status)
        last_status = status
        if status.endswith('COMPLETE') or status == 'ROLLBACK_FAILED':
            if status not in ('CREATE_COMPLETE', 'UPDATE_COMPLETE'):
                print('Something went wrong')
                events = client.describe_stack_events(
                    StackName=CLOUDFORMATION_STACK_NAME
                )
                for event in events['StackEvents']:
                    if event['Timestamp'].replace(tzinfo=None) < starttime:
                        break
                    print(
                        event['ResourceStatus'],
                        event['ResourceType'],
                        event['LogicalResourceId'],
                        event.get('ResourceStatusReason', '')
                    )
            break
        time.sleep(1)


ACTIONS = {
    'lambda': update_lambda,
    'cloudformation': update_cloudformation,
    'trigger': trigger_lambda,
}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("actions", nargs='+', choices=ACTIONS)
    args = parser.parse_args()
    for action in args.actions:
        ACTIONS[action]()
