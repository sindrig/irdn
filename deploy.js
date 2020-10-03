const AWS = require('aws-sdk');
const childProcess = require('child_process');
const branch = require('git-branch');

const config = {
    region: 'eu-west-1',
    sslEnabled: true,
};

// TODO check build dir exists

if (process.env.LOCAL) {
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'irdn-deploy' });
    config.credentials = credentials;
}

AWS.config.update(config);

const CloudFormation = new AWS.CloudFormation();


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

const uploadFiles = ({ outputs: { WebPageBucket, CloudFrontDistribution } }) => {
    if (!WebPageBucket) {
        console.error('WebPageBucket is undefined/null');
        process.exit(1);
    }
    if (!CloudFrontDistribution) {
        console.error('WebPageBucket is undefined/null');
        process.exit(1);
    }
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

const getStack = () => branch().then((branchName) => {
    const expectedStackName = `${branchName}-irdn`;
    console.log('expectedStackName', expectedStackName);
    return new Promise((resolve, reject) => {
        CloudFormation.describeStacks({}, (err, stacks) => {
            let resolved = false;
            if (err) {
                return reject(err);
            }
            stacks.Stacks.forEach((stack) => {
                console.log('stack.StackName', stack.StackName);
                if (stack.StackName === expectedStackName) {
                    const result = {
                        name: stack.StackName,
                        outputs: {},
                    };
                    stack.Outputs.forEach((output) => {
                        result.outputs[output.OutputKey] = output.OutputValue;
                    });
                    console.log('resolved stack', result);
                    resolved = true;
                    resolve(result);
                }
            });
            if (!resolved) {
                reject(new Error('No stack matches'));
            }
        });
    });
});

const args = process.argv.slice(2);
const stack = getStack().catch((err) => {
    console.log('Stack not found, bailing out');
    console.log(err.message);
    process.exit(1);
});

if (args.indexOf('--check') === -1) {
    stack.then(uploadFiles).catch((err) => {
        console.error('Error deploying')
        console.error(err.message)
        process.exit(1)
    });
}
