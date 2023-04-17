import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import "./styles.css";
import { Link } from 'react-router-dom';
import logo from "./logo.png"
/* Component for the LNav bar page */
class NavBar extends React.Component {
  render() {
    return (
        <Navbar className="navBarHeader" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/main">
                    <img src={logo}></img>
                    UofTrade
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/marketplace">Marketplace</Nav.Link>
                    <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
                    <Nav.Link as={Link} to="/MyProfile">My Profile</Nav.Link>
                    <Nav.Link href="/">Logout</Nav.Link>
                </Nav>
                
                <Nav.Link as={Link} to="/PostCreation">
                    <Button className="reg-button" size="sm">Create Post</Button>
                </Nav.Link>
                
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
  }
}

export default NavBar;