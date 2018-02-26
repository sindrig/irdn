// create classes
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

const Header = (props) => {
    const {title, links} = props;
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link className="navbar-brand" to={links[0].href}>{title}</Link>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                {links.map((link, num) => <LinkContainer to={link.href} key={link.key}><NavItem eventKey={num + 1}>{link.text}</NavItem></LinkContainer>)}
            </Nav>
        </Navbar>
    );
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
        active: PropTypes.bool,
        href: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    })),
};

Header.defaultProps = {
    links: [],
};

export default Header;
