import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './styles.css'

/* Component for the Home page */
class CreateAnnouncement extends React.Component {

  
  isAdmin = (userType) => {
    return userType === 'admin'
  }
  
  render() {
    const {userType, addAnnouncement, announcementTitle, announcementMessage, handleInputChange} = this.props
    return (
      <div>
         {
            this.isAdmin(userType) && (
            <div id='announcementCreation'>
              <h3>Create an announcement</h3>
              <div id='announcementCreationForm'>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Announcement Title</Form.Label>
                        <Form.Control type="text" value={announcementTitle} onChange={handleInputChange} name="announcementTitle"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Message</Form.Label>
                        <Form.Control type="text" value={announcementMessage} onChange={handleInputChange} name="announcementMessage"/>
                    </Form.Group>
                    <br/>
                    <Button variant="primary" onClick={addAnnouncement}>
                      Submit
                    </Button>
                </Form>
                </div>            
            </div>)
          } 
        

      </div>
    );
  }
}

export default CreateAnnouncement;