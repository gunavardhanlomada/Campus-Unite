import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import "./home.css";

function Navb({ setRole }) {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand as={Link}to='/'>Campus Unite</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link}to='/'>Home</Nav.Link>
          </Nav>
          <Nav>
          <Nav.Link as={Link}to='/login'>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navb;