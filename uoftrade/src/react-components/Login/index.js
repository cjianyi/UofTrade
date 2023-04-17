/* Full Login Component */

import React from "react";
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import "./styles.css";
import Alert from 'react-bootstrap/Alert'
import NavBarLogin from "../NavBarLogin";
import { login } from "../../action/Login"
/* Component for the Login page */
class Login extends React.Component {
      state = {
      email: '', 
      password: '',
      loginFailed: false
  };
  
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value 
    });   
  }
  
  render() {
    
    return (
      
      <div>
        <NavBarLogin/>
        <Form className="login">
          <h1 className="text-center">Sign In</h1>
          <Form.Group>
            <Form.Label>Email: </Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleInputChange} name='email'/>
            
          </Form.Group>
          <Form.Group>
            <Form.Label className="label">Password: </Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={this.state.password} onChange={this.handleInputChange} name='password' />
          </Form.Group>
          <Button className="button" variant="dark" size="lg" onClick={() => login(this, this.props.app)} >Log In</Button>
          
          
          <Form.Group>
            <Form.Label className="not-reg">Not registered yet?</Form.Label>
          <Link to="/register">
          <Button className="reg-button" variant="dark" size="lg" >Register</Button>
          </Link>
          </Form.Group>
         
          {<Alert show={this.state.loginFailed} variant='danger'>
            <p>  Incorrect email or password!
                  Please try again</p>
            <div className="d-flex justify-content-end">
            <Button onClick={() => {this.setState({loginFailed: false})}}>
                Close
            </Button>
            </div>
          </Alert>}
        </Form>
        
      </div>
    );
  }
}


export default withRouter(Login);