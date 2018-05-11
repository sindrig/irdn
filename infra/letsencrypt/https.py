import argparse
import os
import subprocess
import ConfigParser


BUCKET_NAME = 'irdn.is'
REGION = 'eu-west-1'
CF_ID = 'E14VNCYKDXTTW5'


def get_env():
    config = ConfigParser.RawConfigParser()
    config.read(os.path.expanduser('~/.aws/credentials'))
    return {
        'AWS_ACCESS_KEY_ID': config.get('irdn', 'aws_access_key_id'),
        'AWS_SECRET_ACCESS_KEY': config.get('irdn', 'aws_secret_access_key'),
    }


def main(renew):
    workdir = os.path.dirname(os.path.abspath(__file__))
    output = os.path.join(workdir, 'output')
    installfile = os.path.join(workdir, 'install.sh')

    try:
        os.makedirs(output)
    except OSError:
        pass

    sub_args = [
        os.path.join(workdir, 'venv', 'bin', 'certbot'),
        '--agree-tos',
        '-a', 'certbot-s3front:auth',
        '--certbot-s3front:auth-s3-bucket', BUCKET_NAME,
        '--certbot-s3front:auth-s3-region', REGION,
        # '--certbot-s3front:auth-s3-directory', 'your-bucket-directory',
        '-i', 'certbot-s3front:installer',
        '--certbot-s3front:installer-cf-distribution-id', CF_ID,
        '--config-dir', output,
        '--work-dir', workdir,
        '--logs-dir', output,
        '-d', 'irdn.is',
    ]
    if renew:
        sub_args += ['--renew-by-default', '--text']
    env_string = ' '.join(
        '%s=%s' % (key, val) for key, val in get_env().items()
    )
    cmd_string = ' '.join(sub_args)

    with open(installfile, 'w') as f:
        f.write('#!/usr/bin/env bash\n')
        f.write(env_string)
        f.write(' ')
        f.write(cmd_string)
        f.write('\n')
        f.write(
            'rm -rf %s' % (installfile)
        )

    subprocess.Popen(['chmod', '+x', installfile])
    print('Run `%s` (review it first). Then delete it.' % (installfile,))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--renew', action='store_true', default=False)
    args = parser.parse_args()
    main(args.renew)
