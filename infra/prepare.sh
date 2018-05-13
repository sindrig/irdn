#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BUCKET_NAME=$(cat $DIR/RESOURCE_BUCKET_NAME)

if [ ! -f "$DIR/letsencrypt/code.zip" ]; then
    echo "No letsencrypt/code.zip found, build first!"
    exit 1
fi

if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'
then
    aws s3api create-bucket \
        --bucket $BUCKET_NAME \
        --region eu-west-1 \
        --create-bucket-configuration '{"LocationConstraint": "EU"}' \
        --profile=irdn
fi
# SIZE_IN_S3=$(aws s3api head-object --bucket $BUCKET_NAME --key code.zip --profile=irdn | grep ContentLength | cut -d":" -f2 | cut -d"," -f1 | cut -d" " -f2)
# SIZE_IN_FS=$(stat --printf="%s" $DIR/letsencrypt/code.zip)
# if [ $SIZE_IN_FS -eq $SIZE_IN_S3 ]; then
#     echo "code.zip equals in s3, not uploading"
# else
#     echo "code.zip differs, uploading"
#     aws s3 cp $DIR/letsencrypt/code.zip s3://$BUCKET_NAME/code.zip --profile=irdn
# fi
# aws s3 cp $DIR/irdn-template.json s3://$BUCKET_NAME/irdn-template.json --profile=irdn
# aws s3 cp $DIR/lambci-template.json s3://$BUCKET_NAME/lambci-template.json --profile=irdn
