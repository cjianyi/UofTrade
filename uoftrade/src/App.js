//import logo from './logo.svg';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import React from 'react';

import Login from './react-components/Login';
import ProductListing from './react-components/ProductListing';
import Dashboard from './react-components/Dashboard';
import PostCreation from './react-components/PostCreation'
import Marketplace from './react-components/Marketplace';
import Register from './react-components/Register';
import Profile from './react-components/Profile';
import Messages from './react-components/Messages'


class App extends React.Component{

  state = {
    user: null,
    userType: null
  }

  setGlobalState = (userID, userType) => {
    this.setState({
      user:userID,
      userType:userType
    })
  }
  
  render() {
    return (
      <div>
        
        { /* In order to have the button on the login page direct to the page you want to, follow these steps:
          1. Go into react-components/Login/index.js and change line 17 accordingly
          2. Import your react-component (see above for examples)
          3. Change the line with <Route exact path='/mypage'> to contain your desired react component */}

        <BrowserRouter>
          <Switch> 
            { /* Each Route below shows a different component depending on the exact path in the URL  */ }
            <Route exact path='/' render={() => 
                            (<Login app={this} />)}/>
            <Route exact path='/productlisting/:ownerid/:id' render={(props) => 
                            (<div className = 'app'>
                              {this.state.user ? <ProductListing {... props} app ={this}/>: <Login {... props} app={this}/>}
                            </div>)}/>
            <Route exact path='/postcreation' render={(props) => 
                            (<div className = 'app'>
                              {this.state.user ? <PostCreation {... props} app ={this}/>: <Login {... props} app={this}/>}
                           </div>)}/>
            <Route exact path='/main' render={(props) => 
                             (<div className = 'app'>
                             {this.state.user ? <Dashboard {... props} app ={this}/>: <Login {... props} app={this}/>}
                           </div>)}/>
            <Route exact path='/marketplace' render={(props) => 
                             (<div className = 'app'>
                             {this.state.user ? <Marketplace {... props} app ={this}/>: <Login {... props} app={this}/>}
                           </div>)}/>
            <Route exact path='/register' render={(props) => 
                             (<Register {... props} app ={this}/>)}/>
            <Route exact path='/myprofile' render={(props) => 
                             (<div className = 'app'>
                             {this.state.user ? <Profile {... props} app ={this}/>: <Login {... props} app={this}/>}
                           </div>)}/>
             <Route exact path='/messages' render={(props) => 
                             (<div className = 'app'>
                             {this.state.user ? <Messages {... props} app ={this}/>: <Login {... props} app={this}/>}
                           </div>)}/>
            
              
          </Switch>
        </BrowserRouter>
        

      </div>
    );
  }
}

export default App;
