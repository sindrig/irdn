#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
(
    cd $DIR
    cp ../STACK_NAME .

    rm -rf package
    mkdir package
    cp *.py STACK_NAME package

    virtualenv venv
    . venv/bin/activate

    TMP_DIR=$(mktemp -d)
    git clone git@github.com:crgwbr/certbot-s3front.git $TMP_DIR
    (
        cd $TMP_DIR
        python setup.py install
    )

    cp -r venv/lib/python3.6/site-packages/. package

    cd package
    zip -qyr ../code.zip . -x@../.lambdaignore
)