import React from "react";
import "./styles.css";
import ItemCard from "../ItemCard";
import 'bootstrap/dist/css/bootstrap.min.css';
import { uid } from "react-uid";


class CurrentPostings  extends React.Component {

    
    render() {
      return (
        <div id="currentListing">
          <h3 >Your Current Listings</h3>
          <div id='products'>
          {this.props.items.length === 0 && <h6>You don't have any posts right now. </h6>}  
          {this.props.items.map((i) => {
              return(<ItemCard key={uid(i)} item={i} app={this.props.app} removePost={() => this.props.removePost(this.props.dashboard, i, 'currentPostings')}></ItemCard>)
          })}
          </div>
        </div>        
      );
    }
  }
  
  export default CurrentPostings;

