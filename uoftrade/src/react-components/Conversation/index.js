import React from "react";
import "./styles.css";
import { uid } from "react-uid";

/* Component for the LNav bar page */
class Conversation extends React.Component {
    isReceiver = (message) => {
        if (message.sender === this.props.current)
        {
            return 'current'
        }
        else {
            return 'other'
        }
    }
   
    render() {
        return (
            <div>
                <h5>Conversation with {this.props.receiverName}</h5>
                {
                    this.props.messages.map( (m) => {
                        return(
                            <div key={uid(m)} className={this.isReceiver(m)}>
                                {m.message}
                            </div>                          
                          
                        )
                    })
                }
                <input  placeholder="Type your message" className='messageInput' value={this.props.newMessage} onChange={this.props.handleInputChange} name='newMessage'></input>
                <button className='sendMessage' onClick={() => this.props.sendMessage(this.props.current, this.props.receiver, this.props.conv_id)}>Send message</button>
            </div>
            
        );
    }
}

export default Conversation;