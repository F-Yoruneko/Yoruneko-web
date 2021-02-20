import Link from 'next/link';
import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Link href="/">
            <a>Yoruneko Webアプリ</a>
          </Link>
        </Navbar.Brand>
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
