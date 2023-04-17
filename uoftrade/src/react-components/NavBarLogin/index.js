import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import "./styles.css";
import logo from "./logo.png"

/* Component for the LNav bar page */
class NavBarLogin extends React.Component {
  render() {
    return (
        <Navbar className="navBarHeader" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand>
                  <img src={logo}></img>
                  UofTrade
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
  }
}

export default NavBarLogin;