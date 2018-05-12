const AWS = require('aws-sdk');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const config = {
    region: 'eu-west-1',
    sslEnabled: true,
};

const BUILD_DIR = path.resolve(__dirname, 'build');

// TODO check build dir exists

if (process.env.LOCAL) {
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'irdn' });
    config.credentials = credentials;
}

AWS.config.update(config);

const CloudFormation = new AWS.CloudFormation();


const getS3Bucket = StackName => new Promise((resolve, reject) => {
    CloudFormation.describeStacks({ StackName }, (err, stacks) => {
        if (err) {
            return reject(err);
        }
        return stacks.Stacks.forEach((stack) => {
            stack.Outputs.forEach((output) => {
                if (output.OutputKey === 'WebPageBucket') {
                    resolve(output.OutputValue);
                }
            });
        });
    });
});

const applyToFiles = (files, callback) =>
    files.forEach(file => fs.stat(file, (err2, stat) => {
        if (!stat || stat.isFile()) {
            callback(file);
        }
    }));

const uploadFiles = (BucketArn) => {
    const Bucket = BucketArn.replace('arn:aws:s3:::', '');
    const s3 = new AWS.S3({
        params: { Bucket },
    });
    glob(`${BUILD_DIR}/**`, (err, files) =>
        applyToFiles(
            files,
            (absoluteFilePath) => {
                const relativeFilePath = path.relative(BUILD_DIR, absoluteFilePath);
                fs.readFile(absoluteFilePath, 'utf8', (readErr, data) => {
                    if (readErr) {
                        console.err(readErr);
                        process.exit(1);
                    }
                    s3.upload({
                        Key: relativeFilePath,
                        Body: data,
                        ACL: 'public-read',
                    }, (writeErr) => {
                        if (writeErr) {
                            console.log('There was an error uploading a file: ', err.message);
                        }
                        console.log(`Uploaded: ${relativeFilePath}`);
                    });
                });
            },
        ));
};

fs.readFile('infra/STACK_NAME', 'utf8', (err, StackName) => getS3Bucket(StackName).then(uploadFiles));
