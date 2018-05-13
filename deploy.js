const AWS = require('aws-sdk');
const fs = require('fs');
const childProcess = require('child_process');

const config = {
    region: 'eu-west-1',
    sslEnabled: true,
};

// TODO check build dir exists

if (process.env.LOCAL) {
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'irdn' });
    config.credentials = credentials;
}

AWS.config.update(config);

const CloudFormation = new AWS.CloudFormation();


const getStackOutputs = StackName => new Promise((resolve, reject) => {
    CloudFormation.describeStacks({ StackName }, (err, stacks) => {
        if (err) {
            return reject(err);
        }
        return stacks.Stacks.forEach((stack) => {
            const result = {};
            stack.Outputs.forEach((output) => {
                result[output.OutputKey] = output.OutputValue;
            });
            resolve(result);
        });
    });
});


function runScript(script, args, callback) {
    // keep track of whether callback has been invoked to prevent multiple invocations
    let invoked = false;

    const prokess = childProcess.fork(script, args);

    // listen for errors as they may prevent the exit event from firing
    prokess.on('error', (err) => {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the prokess has finished running
    prokess.on('exit', (code) => {
        if (invoked) return;
        invoked = true;
        const err = code === 0 ? null : new Error(`exit code ${code}`);
        callback(err);
    });
}

const uploadFiles = ({ WebPageBucket, CloudFrontDistribution }) => {
    const args = [
        './build/**',
        '--cwd', './build/',
        '--region', 'eu-west-1',
        '--bucket', WebPageBucket,
        '--distId', CloudFrontDistribution,
    ];
    if (process.env.LOCAL) {
        args.push('--profile');
        args.push('irdn');
    }
    const script = './node_modules/.bin/s3-deploy';
    runScript(script, args, (err) => {
        if (err) throw err;
        console.log('finished upload');
    });
};

fs.readFile('infra/STACK_NAME', 'utf8', (err, StackName) => getStackOutputs(StackName).then(uploadFiles));
