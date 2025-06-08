import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

function Navba({ setRole }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        setRole("null");
        navigate("/");
    };
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand as={Link}to='/'>Campus Unite</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link}to='/'>Home</Nav.Link>
            <Nav.Link as={Link}to='/CreateEvent'>Create a event</Nav.Link>
            <Nav.Link as={Link}to='/Events'>My Events</Nav.Link>
          </Nav>
          <Nav>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navba;