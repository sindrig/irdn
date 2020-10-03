import React from 'react';
import PropTypes from 'prop-types';

const External = ({ href, children }) => <a href={href} target="_new">{children}</a>;

External.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const links = {
    aws: <External href="https://aws.amazon.com/">AWS</External>,
    s3: <External href="https://aws.amazon.com/s3/">S3</External>,
    route53: <External href="https://aws.amazon.com/route53">Route53</External>,
    cloudformation: <External href="https://aws.amazon.com/cloudformation">CloudFormation</External>,
    lambda: <External href="https://aws.amazon.com/lambda">Lambda</External>,
    cloudfront: <External href="https://aws.amazon.com/cloudfront">CloudFront</External>,
    letsencrypt: <External href="https://letsencrypt.org/">letsencrypt</External>,
    react: <External href="https://reactjs.org/">ReactJS</External>,
    githubActions: <External href="https://github.com/features/actions">GitHub Actions</External>,
    github: <External href="https://github.com/sindrig/irdn/">GitHub</External>,
    s3Deploy: <External href="https://www.npmjs.com/package/s3-deploy">s3-deploy</External>,
};

const servicesUsed = [
    links.cloudformation,
    links.s3,
    links.route53,
    links.cloudfront,
];
const serviceStyle = { margin: '0' };

export default () => (
    <div className="about-container">
        <p style={serviceStyle}>
            Hosted on {links.aws} using:
        </p>
        {servicesUsed.map((service, i) => <p key={i} style={serviceStyle}>{service}</p>)}
        <p>
            SSL licence from {links.letsencrypt} updated regularly via {links.lambda}.
        </p>
        <p>
            Actual page overkilled using {links.react}.
        </p>
        <p>
            CI using {links.githubActions}. Automatically deploys using {links.s3Deploy}.
        </p>
        <p>
            All code on {links.github}.
        </p>
    </div>
);
