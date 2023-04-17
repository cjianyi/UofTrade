import React from "react";
import NavBar from "../NavBar";
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Conversation from "../Conversation";
import { uid } from "react-uid";
import { getUserMessages, getUsers, sendNewMessage } from "../../action/Messages"

class Messages extends React.Component {
  state = {
    allUsers: [],
    allConversations: [],
    newMessage:''  
  }

  componentDidMount() {
    getUserMessages(this, this.props.app.state.user)
    getUsers(this,this.props.app.state.user)
  }

  findConversation = (personA, personB) => {
    for (let i = 0; i < this.state.allConversations.length; i++)
    {
      if (this.state.allConversations[i].people.includes(personA) && this.state.allConversations[i].people.includes(personB)) {
        return this.state.allConversations[i]
      }
    }
  }

  getReceiverName = (personID) => {
    for (let i = 0; i < this.state.allUsers.length; i++)
    {
      if (this.state.allUsers[i]._id === personID) {
          return this.state.allUsers[i].name
      }
    }
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value 
    });       
  }

  sendMessage = (senderID,receiverID, convID) => {
    if (this.state.newMessage !== '')
    {
      sendNewMessage(senderID, receiverID, this,  convID)
    }
    
}

  render() {
    return (
      <div>
        <NavBar></NavBar>
        <h3>Your Messages</h3>
        <div className="messagesContainer">
        <Tab.Container defaultActiveKey="0">
          <Row h-auto='true'>
            <Col id='contacts'>
              <h5>Your Contacts</h5> 
              <Nav className="flex-column">
                {this.state.allUsers.map((user) => {
                  return(       
                    <Nav.Item key={uid(user)}>
                      <Nav.Link eventKey={user._id}>{user.name}</Nav.Link>
                    </Nav.Item>)            
                })}
              </Nav>
            </Col>
            <Col xs={10} h-auto='true' id = 'conversation'>
              <Tab.Content>
                {this.state.allUsers.map((user) => {
                    const conversation = this.findConversation(user._id, this.props.app.state.user)
                    const otherName = this.getReceiverName(user._id)
                    return(       
                      < Tab.Pane key={uid(user)} eventKey={user._id}>
                        {conversation &&<Conversation messages={conversation.messageHistory} 
                        current={this.props.app.state.user} 
                        receiver={user._id} 
                        conv_id = {conversation._id}
                        receiverName={otherName} 
                        newMessage={this.state.newMessage} 
                        handleInputChange={this.handleInputChange}
                        sendMessage ={this.sendMessage}/>}
                      </Tab.Pane>)            
                  })}         
                  < Tab.Pane eventKey="0">
                        <h5> Select a contact to view your conversation history</h5>
                  </Tab.Pane>      
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        </div>
    
      </div>
    );
  }
}

export default Messages;