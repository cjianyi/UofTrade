import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { uid } from "react-uid";
import { removeAnnouncement } from "../../action/Announcement";
import "./styles.css";

class Announcements  extends React.Component {

    isAdmin = (user) => {
      return user === 'admin'
    };
    
    render() {
      const { announcements, userType, dashboard} = this.props
      return (
        <div id='announcementDiv'>          
          <div id="annoucementContainer">        
          <h3>Announcements</h3>
          {announcements.length === 0 && <h6>There are no announcements currently</h6>}  
          {announcements.map((announcement) => {
            return (
              <Alert key={uid(announcement)} className="announcement" variant='secondary'> 
              <Alert.Heading>
                {announcement.title}
              </Alert.Heading>
              <p>
                {announcement.content}
              </p>              
              <div className="d-flex justify-content-end">    
              {
                this.isAdmin(userType) && (<Button variant="primary" onClick={() => removeAnnouncement(dashboard, announcement._id)}>
                Remove
                </Button>)
              }                   
              </div>         
            </Alert>
            )
          })}          
          </div>
        </div>
        
      );
    }
  }
  
export default Announcements;