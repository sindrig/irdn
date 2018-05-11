#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BUCKET_NAME=$(cat $DIR/BUCKET_NAME)

if [ ! -f "$DIR/code.zip" ]; then
    echo "No code.zip found, build first!"
    exit 1
fi

aws s3api create-bucket --bucket=$BUCKET_NAME --profile=irdn
aws s3 cp $DIR/code.zip s3://$BUCKET_NAME/code.zip --profile=irdn
