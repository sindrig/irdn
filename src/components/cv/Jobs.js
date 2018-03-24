// create classes
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import tempoImage from '../../images/tempo.svg';
import hreyfisedillImage from '../../images/hreyfisedill.jpg';
import trackwellImage from '../../images/trackwell.png';
import hiImage from '../../images/hi.png';
import vikesImage from '../../images/vikes.jpg';
import { rowStyle } from '../styles';

const Job = ({
    image,
    company,
    companyLink,
    fromDate,
    toDate,
    children,
}) => (
    <Row style={rowStyle}>
        <Col xs={2} md={2}>
            <img src={image} alt={company} className="company-image" />
        </Col>
        <Col xs={10} md={10}>
            <div>
                <h3>
                    {companyLink ?
                        <a href={companyLink} target="_new">{company}</a> :
                        company}
                </h3>
                {fromDate} - {toDate}
            </div>
            {children}
        </Col>
    </Row>
);
Job.propTypes = {
    image: PropTypes.node.isRequired,
    company: PropTypes.string.isRequired,
    companyLink: PropTypes.string,
    children: PropTypes.node.isRequired,
    fromDate: PropTypes.string.isRequired,
    toDate: PropTypes.string,
};

Job.defaultProps = {
    companyLink: null,
    toDate: 'Current',
};

const Tempo = () => (
    <Job company="Tempo" fromDate="Jan 2016" image={tempoImage} companyLink="https://tempo.io">
        <p>
            Worked on everything from writing front-end in React.js to back-end in
            python/java to ops/dev-ops using kubernetes on AWS.
        </p>
    </Job>
);
const Hreyfikerfi = () => (
    <Job company="Hreyfistjórnun" fromDate="Nov 2010" image={hreyfisedillImage} companyLink="https://hreyfisedill.is">
        <p>
            Wrote a web application using Ruby on Rails for physiotherapists and
            patients to communicate and record physical exercise. Rewrote the
            system in 2013 using Python/Django.
        </p>
        <p>Also wrote a VOIP client using Asterisk and Python.</p>
        <p>
            Played a role in the introduction of physical exercise
            prescriptions by the government.
        </p>
    </Job>
);

const Trackwell = () => (
    <Job company="Trackwell" fromDate="May 2011" toDate="Jan 2016" image={trackwellImage} companyLink="https://www.trackwell.com">
        <p>
            Tímon system owner as well as various small-to-medium projects.
        </p>
    </Job>
);

const HI = () => (
    <Job company="University of Iceland" fromDate="Jan 2012" toDate="May 2016" image={hiImage} companyLink="https://www.hi.is">
        <p>
            Software development (Þróun hugbúnaðar) assistant teacher spring 2012
        </p>
    </Job>
);

const Vikes = () => (
    <Job company="Vikingur FC" fromDate="Sep 2001" toDate="May 2011" image={vikesImage} companyLink="http://www.vikingur.is">
        <p>
            Youth football (soccer) coach. Mostly U12 and U16 boys.
        </p>
    </Job>
);

export default () => (
    <div>
        <Tempo />
        <Hreyfikerfi />
        <Trackwell />
        <HI />
        <Vikes />
    </div>
);
