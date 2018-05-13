import os
import boto3

import pkg_resources
old_iter_entry_points = pkg_resources.iter_entry_points


def wrapped(group, name=None):
    # Not cool, not hip, but certbot gives us no other options
    result = old_iter_entry_points(group, name=name)
    if group == 'certbot.plugins':
        result = list(result)[:-2]
        entries = [(e.name, e.module_name, e.attrs) for e in result]
        to_create = [
            (
                'auth',
                'certbot_s3front.authenticator',
                ('Authenticator', ),
            ),
            (
                'installer',
                'certbot_s3front.installer',
                ('Installer', ),
            ),
        ]
        dist = pkg_resources.Distribution(
            project_name='certbot_s3front'
        )
        for data in to_create:
            if data not in entries:
                name, module_name, attrs = data

                result.append(
                    pkg_resources.EntryPoint(
                        name,
                        module_name,
                        attrs=attrs,
                        dist=dist,
                    )
                )
    return result


# pkg_resources.iter_entry_points = wrapped

from certbot.main import main as certbot_main  # noqa

REGION = 'eu-west-1'
session_kwargs = {}
if os.getenv('LOCAL'):
    session_kwargs['profile_name'] = 'irdn'

session = boto3.Session(**session_kwargs)


def get_stack_outputs():
    with open(os.path.join(os.path.dirname(__file__), 'STACK_NAME')) as f:
        stack_name = f.read()
    client = session.client('cloudformation', region_name=REGION)
    stack = client.describe_stacks(StackName=stack_name)['Stacks'][0]
    return {
        output['OutputKey']: output['OutputValue']
        for output in stack['Outputs']
    }


def main(renew):
    outputs = get_stack_outputs()
    workdir = os.path.dirname(os.path.abspath(__file__))
    output = os.path.join(workdir, 'output')

    credentials = session.get_credentials()

    os.environ['AWS_ACCESS_KEY_ID'] = credentials.access_key
    os.environ['AWS_SECRET_ACCESS_KEY'] = credentials.secret_key

    try:
        os.makedirs(output)
    except OSError:
        pass

    sub_args = [
        '--agree-tos',
        '-a', 'certbot-s3front:auth',
        '--certbot-s3front:auth-s3-bucket', outputs['WebPageBucket'],
        '--certbot-s3front:auth-s3-region', REGION,
        # '--certbot-s3front:auth-s3-directory', 'your-bucket-directory',
        '-i', 'certbot-s3front:installer',
        '--certbot-s3front:installer-cf-distribution-id',
        outputs['CloudFrontDistribution'],
        '--config-dir', output,
        '--work-dir', workdir,
        '--logs-dir', output,
        '-d', 'irdn.is',
        '-m', 'sindrigudmundsson@gmail.com',
        '-n'
    ]
    if renew:
        sub_args += ['--renew-by-default', '--text']

    certbot_main(cli_args=sub_args)


def handler(json_input, context):
    main(renew=False)


if __name__ == '__main__':
    handler(None, None)
    # parser = argparse.ArgumentParser()
    # parser.add_argument('--renew', action='store_true', default=False)
    # args = parser.parse_args()
    # main(args.renew)