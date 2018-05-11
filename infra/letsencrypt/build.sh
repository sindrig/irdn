#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
(
    cd $DIR

    pip install -r requirements.txt -t lib
    zip -qyr code.zip $DIR -x@.lambdaignore
)