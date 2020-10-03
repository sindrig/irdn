// create classes
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const Header = (props) => {
    const { title, links } = props;
    return (
        <Navbar>
            <Navbar.Brand>
                <Link className="navbar-brand" to={links[0].href} href={links[0].href}>
                    {title}
                </Link>
            </Navbar.Brand>
            <Nav>
                {links.map((link, num) => {
                    if (link.hidden && window.location.pathname !== link.href) {
                        return null;
                    }
                    return (
                        <Nav.Item key={link.key}>
                            <Nav.Link eventKey={num + 1} href={link.href}>{link.text}</Nav.Link>
                        </Nav.Item>
                    );
                })}
            </Nav>
        </Navbar>
    );
};

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
