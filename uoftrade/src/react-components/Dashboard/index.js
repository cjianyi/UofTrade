import React from "react";
import Announcements from "../Announcements";
import NavBar from "../NavBar";
import CurrentPostings from "../CurrentPostings";
import CreateAnnouncement from "../CreateAnnouncment";
import { addAnnouncement, getAnnouncement } from "../../action/Announcement";
import ReportedPost from '../ReportedPost'
import {getAllReportedItems} from '../../action/report'
import {removePost} from '../../action/postings'
import { getCurrentPostings } from '../../action/postings'

class Dashboard extends React.Component {
  state = {
    announcementTitle: '',
    announcementMessage: '',
    announcements: [],
    items: [],
    reportedItems: []
  };
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value 
    });
  }

  
  componentDidMount() {
    getAllReportedItems(this)
    getCurrentPostings(this, this.props.app.state.user)
    getAnnouncement(this)
  }
    render() {
      return (
        <div>
          <NavBar/>
          <Announcements announcements={this.state.announcements} userType={this.props.app.state.userType} dashboard={this}></Announcements>
          <CreateAnnouncement userType={this.props.app.state.userType} announcementTitle={this.state.announcementTitle} announcementMessage={this.state.announcementMessage} handleInputChange={this.handleInputChange} addAnnouncement={() => addAnnouncement(this)}/>
          <CurrentPostings dashboard={this} app={this.props.app} items={this.state.items} removePost={removePost}/>
          {this.props.app.state.userType === 'admin' && <ReportedPost app= {this.props.app} reportedItems ={this.state.reportedItems} removePost={removePost} dashboard={this}></ReportedPost>}
        </div>
      );
    }
  }
  
  export default Dashboard;