import React from 'react';
import PropTypes from 'prop-types';

const External = ({ href, children }) => <a href={href} target="_new">{children}</a>;

External.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

const links = {
    aws: <External href="https://aws.amazon.com/">AWS</External>,
    s3: <External href="https://aws.amazon.com/s3/">S3</External>,
    route53: <External href="https://aws.amazon.com/route53">Route53</External>,
    cloudfront: <External href="https://aws.amazon.com/cloudfront">CloudFront</External>,
    letsencrypt: <External href="https://letsencrypt.org/">letsencrypt</External>,
    react: <External href="https://reactjs.org/">ReactJS</External>,
    lambci: <External href="https://github.com/lambci/lambci/">LambCI</External>,
    github: <External href="https://github.com/sindrig/irdn/">GitHub</External>,
};

export default () => (
    <div>
        <p>
            Hosted on {links.aws} using {links.s3}, {links.route53} and {links.cloudfront}.
            SSL licence from {links.letsencrypt}.
        </p>
        <p>
            Actual page overkilled using {links.react}.
        </p>
        <p>
            CI using {links.lambci}. All code on {links.github}.
        </p>
    </div>
);
