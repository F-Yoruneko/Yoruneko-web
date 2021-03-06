import Link from 'next/link';
import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Link href="/">
            <a>Campus Hack</a>
          </Link>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end"><FontAwesomeIcon icon={faUserCircle} /></Navbar.Collapse>
      </Navbar>
      <Container fluid>
        <div style={{ marginTop: '4rem', padding: '0 50px' }}>
          <div className="site-layout-content">{children}</div>
        </div>
      </Container>
      <style jsx>{`
        .site-layout-content {
          min-height: 280px;
          padding: 24px;
          background: #fff;
        }
      `}</style>
    </>
  );
};

export default Layout;
