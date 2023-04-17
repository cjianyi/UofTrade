import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './../NavBar';
import "./styles.css";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CategoryFormInPostCreation from './../CategoryFormInPostCreation'
import {createPost} from '../../action/PostCreation'

/* Component for the Home page */
class PostCreation extends React.Component {
  state = {
    message: {
      body: "",
      type: ""
    },
    title: '',
    price: 0,
    description: '',
    tag: 'All Categories',
    image: null
    
  };
  isSuccess = () => {
    return this.state.message.type === 'success'
  }
  isError = () => {
    return this.state.message.type === 'error'
  }
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
        <NavBar></NavBar>
        <div id='postCreation'>
            <h2>Create a Post</h2>
            <div id='postCreationForm'>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    createPost(e.target, this);
                }}> 
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control required type="text" placeholder="" name='title' value={this.state.title} onChange={this.handleInputChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="" name='price' value={this.state.price} onChange={this.handleInputChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required as="textarea" rows={3} name='description' value={this.state.description} onChange={this.handleInputChange}/>
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Product image</Form.Label>
                      <Form.Control required type="file" name='image' value={this.state.image} onChange={this.handleInputChange} accept="image/png, image/jpeg"/>
                    </Form.Group>
                    <Form.Label>Categories</Form.Label>
                    <CategoryFormInPostCreation className='spanwidth' handleInputChange={this.handleInputChange}></CategoryFormInPostCreation>
                    <br/>
                    <Button variant="primary" type='submit' onSubmit={(e) => createPost(e.target, this)}>
                      Submit
                    </Button>
                    <br/>
                    <br/>
                    {this.isSuccess() && <div className="alert alert-success" role="alert">
                      Post created Successfully.
                    </div>}
                    {this.isError() && <div className="alert alert-danger" role="alert">
                      Error! Please try again. {this.state.message.body}
                    </div>}
                </Form>
            </div>
            
        </div>

      </div>
    );
  }
}

export default PostCreation;