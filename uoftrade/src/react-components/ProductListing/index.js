/* Full ProductListing Component */
import React from "react";

import Button from "react-bootstrap/Button";
import NavBar from "../NavBar";
import "./styles.css";
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import ReportPopup from "../ReportPopup";
import {getProductInfo, getOwner, report, editPost} from '../../action/ProductListing'

class ProductListing extends React.Component {  
    state = {
        popText: '',
        showPopup: false,
        item: {
            usersReported: [],
            _id: '',
            title: "",
            price: 0,
            description: "",
            tag: "",
            image: {
                _id: "",
                image_id: "",
                image_url: "",
                created_at: ""
            }
        },
        owner: {
            _id: '',
            name: '',
            email: '',
            bio: '',
            image: {
                _id: "",
                image_id: "",
                image_url: "data:image/png;base64,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",
                created_at: ""
            }
        },
        title: '',
        price: '',
        description: '',
        savedPost: false
    }
    
    
    componentDidMount() {
        getProductInfo(this)
        getOwner(this)        
    }
    getCurrentPosting = () => {
        const {id} = this.props.match.params
        return this.state.items.filter((i) => i.id === parseInt(id))[0]
    }

    getOwnerName = (ownerID) => {
        return this.state.allUsers.filter((u) => {
            return u.id === ownerID
        })
    }


    reportPost = (currentUser, owner, itemID) => {
        report(this, currentUser, owner, itemID)
    }
    togglePopup = () =>{  
        this.setState({ showPopup: !this.state.showPopup });  
    }  

    isOwner = () => {
        return this.state.owner._id === this.props.app.state.user
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value 
        });       
      }

    saveInfo = () => {
        if (this.state.price !== '' && this.state.title !== '' && this.state.description !== '')
        {
            editPost(this, this.state.owner._id, this.state.item._id)
        }       
    }
    
    render (){
        const currentPostings = this.state.item
        return (            
            <div>
                <NavBar></NavBar>
             
                <h4 className='path'>{this.state.item.tag}</h4>
                <img className='productImage' src={currentPostings.image.image_url} alt="Product"/>
                
                <div className='productInfo'>
                    <h2 className='titleProduct'>{currentPostings.title}</h2>
                    <h3 className='price'>${currentPostings.price}</h3>


                    <div className='description'>
                        <h5>Description</h5>

                        <div className='buttonContainer'>
                            <Button onClick={() => this.reportPost(this.props.app.state.user, this.state.owner._id, this.state.item._id)}>Report</Button>

                            {this.state.showPopup &&
                            <ReportPopup
                                text={this.state.popText}
                                closePopup={this.togglePopup}
                            />
                            }
                            
                            {this.props.app.state.userType === 'Admin' &&
                                <Button>Remove</Button>
                            }
                        </div>  
                    </div>
                    

                    <div className='descriptionContainer'>
                        <div className='descriptionContent'>{currentPostings.description}</div>
                    </div>
                    
                    <div className='profileIconContainer'>
                        
                        {this.state.owner.image && <img src={this.state.owner.image.image_url} className='profileIcon' alt='profile'/>}
                        {!this.state.owner.image && <img src={"data:image/png;base64,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"} className='profileIcon' alt='profile'/>}
                    </div>
                    
                    <div className='profileInfoContainer'>
                        <h5 className='profileName'>{this.state.owner.name}</h5>
                    </div>

                    {
                        !this.isOwner() && 
                        <Link to="/messages" id="contactOwner"> 
                            <Button >
                                Contact
                            </Button>
                        </Link>
                    }
                </div>
                
                
    
                {
                    this.isOwner() &&
                    <div className='productEditSection'>
                        <h2 className='editTitle'>Edit Info</h2>

                        <div className='textBoxContainer'>
                            <div>
                                <h5> Title </h5>
                                <input placeholder ={ currentPostings.title }
                                value = {this.state.title}
                                onChange={this.handleInputChange}
                                name='title'
                                />
                            </div>

                            <br></br>
                            <div>                                
                                <h5> Price ($)</h5>
                                <input placeholder = {currentPostings.price}
                                value={this.state.price}                                
                                onChange={this.handleInputChange}
                                name='price'
                                />
                            </div>

                            <br></br>
                            
                            <div>
                                <h5> Description </h5>
                                <input placeholder = {currentPostings.description}
                                value={this.state.description}                                
                                onChange={this.handleInputChange}
                                name='description'
                                />
                            </div>
                        </div> 

                        <div className='editButtonContainer'>
                            <Button variant='primary' onClick={this.saveInfo}>Save Changes</Button>
                            {/* <Button variant='secondary' onClick={this.removePost}>Remove Posting</Button> */}
                        </div>
                        {this.state.savedPost && <Alert variant='success'>
                            Post successfully updated
                        </Alert>}
                    </div>
                }
        </div>

            
            
        );
    }
}

export default ProductListing;