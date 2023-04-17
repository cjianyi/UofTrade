import React from "react";
import Button from 'react-bootstrap/Button'
import './styles.css';


class ReportPopup extends React.Component {
    render (){
        return(
            <div className='popup'>  
                <div className='popup-open'>  
                    <h4 className='text'>{this.props.text}</h4>
                   
                    <Button onClick={this.props.closePopup}>Close</Button>  
                    
                
                </div>  
            </div>
        );
    }
  };


export default ReportPopup;