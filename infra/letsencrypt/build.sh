#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pip install -r $DIR/requirements.txt -t $DIR
