import React from "react";
import { withRouter } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import "./styles.css";
import NavBarLogin from '../NavBarLogin'
import { register } from "../../action/Login"
import Alert from 'react-bootstrap/Alert'


class Register extends React.Component {

    state = {
        name: '',
        bio: '',
        email: '',
        password: '',
        reenterPassword: '',
        validated: false,
        passwordMatch: true
    }
    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
       
      }
      

    handleSubmit = (event) => {
        
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.setState({
            validated: true            
        })
        
        if (this.state.reenterPassword !== this.state.password) {
            this.setState({
                passwordMatch: false
            })
        }
        else {
            if (this.state.name && this.state.email && this.state.password !== ''){
                register(this, this.props.app) 
            }
        }        
    }
    samePass = () => {
        if (this.state.password === this.state.reenterPassword){
            return true
        }else{
            return false
        }
    }
    
    isuoftEmail = () => {
        if (this.state.email.includes("@mail.utoronto.ca") || this.state.email.includes("@utoronto.ca")){
            return true
        }else{
            return false
        }
    }
    render(){
        return(
            <div className="home__bg-image center">
                <NavBarLogin></NavBarLogin>
                <Form noValidate validated={this.state.validated} className="sign-up" >
                    
                <h1 className="text-center">Sign Up</h1>
                    <Form.Group >
                            <Form.Label className="name">Name: </Form.Label>
                            <Form.Control required type= "text" value={this.state.name} onChange={this.handleInputChange} placeholder="Enter First Name" name="name" />
                            <Form.Control.Feedback type="invalid">This field cannot be empty</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className='label'>
                            <Form.Label>Bio: </Form.Label>
                            <Form.Control value={this.state.bio} onChange={this.handleInputChange}  placeholder="Enter Bio" name="bio" />
                    </Form.Group>
                        
                    <Form.Group>
                            <Form.Label>UofT Email: </Form.Label>
                            <Form.Control required type="email" value={this.state.email} onChange={this.handleInputChange}  placeholder="Enter UofT email" name="email" />
                            <Form.Control.Feedback type="invalid">This email is not valid, it has to be a registered UofT email</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="label">Password: </Form.Label>
                            <Form.Control required type="password"value={this.state.password} onChange={this.handleInputChange} placeholder="Enter password" name="password"/>
                            <Form.Control.Feedback type="invalid">This field cannot be empty</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="label">Re-enter Password: </Form.Label>
                            <Form.Control required type="password" value={this.state.reenterPassword} onChange={this.handleInputChange} placeholder="Re-enter password" name="reenterPassword"/>
                           <Form.Control.Feedback type="invalid">This field cannot be empty or the password does not match</Form.Control.Feedback>
                        </Form.Group>

                       
                        <Button className="button" variant="dark" size="lg" onClick={this.handleSubmit} >Register</Button>
                        <p className="already-registered">Already registered?  <a href="/">Sign in</a></p>
                        {!this.state.passwordMatch && <Alert variant='danger'>
                        Password doesn't match
                        Please try again
                        </Alert>}
                       
                        
                </Form>
                
                
                
        </div>
        )
    }

}

export default withRouter(Register)