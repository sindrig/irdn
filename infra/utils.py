import datetime
import re
import os
import subprocess
import sys
import time


def get_stack_outputs(client):
    outputs = client.describe_stacks(
        StackName=get_stack_name()
    )['Stacks'][0]['Outputs']
    return {
        output['OutputKey']: output['OutputValue']
        for output in outputs
    }


def get_branch():
    if os.getenv('BRANCH_OVERRIDE'):
        return os.getenv('BRANCH_OVERRIDE')
    args = [
        'git',
        'rev-parse',
        '--abbrev-ref',
        'HEAD',
    ]
    p = subprocess.Popen(args, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    branch, err = p.communicate()
    if err:
        raise RuntimeError(err)
    return branch.decode('utf8').strip()


def get_stack_name():
    suffix = 'irdn'
    branch = get_branch()
    return '%s-%s' % (branch, suffix)


def get_domain():
    if os.getenv('DOMAIN'):
        return os.getenv('DOMAIN')
    suffix = 'irdn.is'
    branch = get_branch()
    return '%s.%s' % (branch, suffix)


def confirm_or_exit(msg):
    if input(msg).lower()[0] == 'y':
        return True
    sys.exit(1)


def wait_for_stack_update_finish(cloudformation, stack_name):
    sleeptime = 1
    starttime = datetime.datetime.utcnow()
    last_status = None
    iterations = 0
    while True:
        stacks = cloudformation.describe_stacks(
            StackName=stack_name
        )
        status = stacks['Stacks'][0]['StackStatus']
        if status != last_status:
            print(status)
        last_status = status
        if status.endswith('COMPLETE') or status == 'ROLLBACK_FAILED':
            if status not in ('CREATE_COMPLETE', 'UPDATE_COMPLETE'):
                print('Something went wrong')
                events = cloudformation.describe_stack_events(
                    StackName=stack_name
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
        time.sleep(sleeptime)
        iterations += 1
        if iterations % 15 == 0 and sleeptime < 5:
            sleeptime += 1


def get_certificate(session):
    domain = get_domain()
    certificate_regex = re.compile('le-(.*)-\\d+')
    client = session.client('iam')
    certificates = client.list_server_certificates(
        PathPrefix="/cloudfront/letsencrypt/"
    )
    for certificate in certificates['ServerCertificateMetadataList']:
        cert_name = certificate['ServerCertificateName']
        search = certificate_regex.search(cert_name)
        if search and search.groups() and search.groups()[0] == domain:
            return certificate
