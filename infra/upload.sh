#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BUCKET_NAME=$(cat $DIR/RESOURCE_BUCKET_NAME)

if [ ! -f "$DIR/letsencrypt/code.zip" ]; then
    echo "No letsencrypt/code.zip found, build first!"
    exit 1
fi

aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region eu-west-1 \
    --create-bucket-configuration '{"LocationConstraint": "EU"}' \
    --profile=irdn
aws s3 cp $DIR/letsencrypt/code.zip s3://$BUCKET_NAME/code.zip --profile=irdn
aws s3 cp $DIR/irdn-template.json s3://$BUCKET_NAME/irdn-template.json --profile=irdn
