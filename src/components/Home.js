import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import sindri from '../images/sindri.jpg';


const socialUrls = [
    'https://github.com/sindrig',
    'https://www.linkedin.com/in/sindrig/',
    'https://twitter.com/sindrig88',
];


export default () => (
    <Container fluid>
        <Row>
            <Col>
                <img src={sindri} alt="Sindri Guðmundsson" className="profile-pic" />
            </Col>
            <Col>
                    <h1>About me</h1>
                    <p>
                        Developer, currently employed at <a href="https://andes.is/">Andes</a> in Iceland.
                    </p>
                    {socialUrls.map(s => <SocialIcon url={s} fgColor="white" bgColor="black" key={s} />)}
            </Col>
        </Row>
    </Container>
);
