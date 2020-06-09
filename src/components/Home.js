import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import sindri from '../images/sindri.jpg';


const socialUrls = [
    'https://github.com/sindrig',
    'https://www.linkedin.com/in/sindrig/',
    'https://twitter.com/sindrig88',
];


export default () => (
    <Grid>
        <Row>
            <Col xs={4} md={4}>
                <img src={sindri} alt="Sindri Guðmundsson" />
            </Col>
            <Col xs={8} md={8}>
                <h1>About me</h1>
                <p>
                    I'm a developer, currently employed at <a href="https://tempo.io">Tempo</a> in Iceland.
                </p>
                {socialUrls.map(s => <SocialIcon url={s} color="black" key={s} />)}
            </Col>
        </Row>
    </Grid>
);
