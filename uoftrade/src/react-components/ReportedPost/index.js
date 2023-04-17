import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemCard from '../ItemCard'
import './styles.css'
import { uid } from "react-uid";

/* Component for the Home page */
class ReportedPost extends React.Component {
  
  render() {
    const {dashboard} = this.props
    return (
      <div id='reportedPost'>
          <h3>Reported Posts</h3>
          <div id='reportedItems'>
          {this.props.reportedItems.length === 0 && <h6>There are no reported posts right now</h6>}  
              {this.props.reportedItems.map((i) => {
                return(<ItemCard key={uid(i)} app= {this.props.app} item={i} userType='admin' removePost={() => this.props.removePost(dashboard, i, 'reportedPost')}></ItemCard>)
              })}
          </div>
            

      </div>
    );
  }
}

export default ReportedPost;