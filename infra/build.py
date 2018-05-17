import os
import subprocess
import json
import argparse
import pprint

import boto3
import botocore

import utils

# We assume that we've already run make upload
REGION = 'eu-west-1'
DIR = os.path.dirname(os.path.abspath(__file__))

session = boto3.Session(profile_name='irdn')
cloudformation = session.client('cloudformation', region_name=REGION)


def update_lambda():
    '''Updates lambda code with code from S3'''
    outputs = utils.get_stack_outputs(cloudformation)
    lambda_function_name = outputs['LambdaFunctionName']
    client = session.client('lambda', region_name=REGION)
    with open(os.path.join(DIR, 'letsencrypt', 'code.zip'), 'rb') as f:
        client.update_function_code(
            FunctionName=lambda_function_name,
            ZipFile=f.read(),
        )
    print('Lambda function %s updated' % (lambda_function_name, ))


def trigger_lambda():
    outputs = utils.get_stack_outputs(cloudformation)
    client = session.client('lambda', region_name=REGION)
    lambda_function_name = outputs['LambdaFunctionName']
    response = client.invoke(
        FunctionName=lambda_function_name,
        InvocationType='RequestResponse'
    )
    if response['StatusCode'] == 200:
        print('Lambda function triggered')
        response = response['Payload'].read()
        try:
            response = json.loads(response)
        except Exception:
            print('Could not load json')
        pprint.pprint(response)
    else:
        print('Error triggering lambda')
        pprint.pprint(response)


def delete_stack():
    stack_name = utils.get_stack_name()
    stack = cloudformation.describe_stacks(StackName=stack_name)
    status = stack['Stacks'][0]['StackStatus']
    msg = (
        'Are you sure you want to delete stack %s with status %s?'
    ) % (stack_name, status)
    if utils.confirm_or_exit(msg):
        outputs = utils.get_stack_outputs(cloudformation)

        s3_bucket = outputs['WebPageBucket']
        s3 = session.resource('s3')
        bucket = s3.Bucket(s3_bucket)
        bucket.objects.all().delete()

        cloudformation.delete_stack(StackName=stack_name)
        try:
            utils.wait_for_stack_update_finish(cloudformation, stack_name)
        except botocore.exceptions.ClientError as e:
            if e.args[0].endswith('does not exist'):
                print('Stack %s deleted!' % (stack_name))
            else:
                raise e

        if input('Also delete the SSL certificate?').lower() == 'y':
            return ['delete_cert']


def update_cloudformation(template='irdn-template.json'):
    '''Updates cloudformation stack with definition in S3'''
    created = False
    domain = utils.get_domain()
    stack_name = utils.get_stack_name()
    certificate = utils.get_certificate(session) or {}
    with open(os.path.join(DIR, template)) as f:
        template_body = f.read()
    stack_kwargs = dict(
        StackName=stack_name,
        TemplateBody=template_body,
        Capabilities=['CAPABILITY_IAM'],
        Parameters=[
            {
                'ParameterKey': 'Domain',
                'ParameterValue': domain
            },
            {
                'ParameterKey': 'CertificateId',
                'ParameterValue': certificate.get('ServerCertificateId', '')
            },
        ],
    )
    try:
        stack = cloudformation.describe_stacks(StackName=stack_name)
        if stack['Stacks'][0]['StackStatus'] == 'ROLLBACK_COMPLETE':
            msg = (
                'Stack is in ROLLBACK_COMPLETE. Want to delete and recreate?'
            )
            if utils.confirm_or_exit(msg):
                cloudformation.delete_stack(StackName=stack_name)
                cloudformation.create_stack(**stack_kwargs)
                created = True
        else:
            cloudformation.update_stack(**stack_kwargs)
    except botocore.exceptions.ClientError as e:
        if e.args[0].endswith('does not exist'):
            msg = 'Stack %s does not exist. Want to create it?' % (
                stack_name,
            )
            if utils.confirm_or_exit(msg):
                cloudformation.create_stack(**stack_kwargs)
                created = True
        elif e.args[0].endswith('No updates are to be performed.'):
            print('There are no updates to cloudformation stack, bailing out')
            return
        else:
            raise e
    utils.wait_for_stack_update_finish(cloudformation, stack_name)
    post_functions = []
    if not certificate:
        # Re-trigger cloudformation after lambda is finished
        post_functions.append('cloudformation')
    if created:
        post_functions.append('deploy')
    return post_functions


def deploy_main_page():
    print(os.path.dirname(DIR))
    to_run = 'clean', 'build', 'deploy'
    for make_command in to_run:
        p = subprocess.Popen(
            ['make %s' % make_command],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True,
            cwd=os.path.dirname(DIR),
            env=dict(
                **os.environ,
                LOCAL='true'
            )
        )
        out, err = p.communicate()
        if err:
            raise RuntimeError(err)
        print(out.decode('utf8'))


def delete_cert():
    certificate = utils.get_certificate(session)
    if not certificate:
        print('Certificate not found')
    utils.delete_certificate(session, certificate)
    print('Certificate %s deleted' % (certificate, ))


ACTIONS = {
    'lambda': update_lambda,
    'cloudformation': update_cloudformation,
    'trigger': trigger_lambda,
    'delete': delete_stack,
    'deploy': deploy_main_page,
    'delete_cert': delete_cert,
}

if __name__ == '__main__':
    print('Running for stack %s with domain %s' % (
        utils.get_stack_name(),
        utils.get_domain()
    ))
    parser = argparse.ArgumentParser()
    parser.add_argument("actions", nargs='+', choices=ACTIONS)
    args = parser.parse_args()
    actions = args.actions[:]
    last_action = None
    while actions:
        action = actions.pop(0)
        if action != last_action:
            # Make sure we don't loop forever
            last_action = action
            actions += ACTIONS[action]() or []
