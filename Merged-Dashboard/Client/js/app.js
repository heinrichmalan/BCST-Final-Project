import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Import components

import Test from "./components/Test";
import Sidebar from "./components/Sidebar";
import Topnav from "./components/Topnav";
import Home from "./components/Home";
import CurPatients from "./components/CurPatients";
import DisPatients from "./components/DisPatients";
import ExamplePatient from "./components/ExamplePatient";
import Login from "./components/Login";
import Register from "./components/Register";
import AddPatient from "./components/AddPatient";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //isLoggedin: false,
      //username: "Log in"
      isLoggedin: true,
      username: "Leanne Hasset"
    }
  }
  
  updateStatus(option){
    this.setState(option);
  }

  getLoginPage(){
    if(this.state.isLoggedin){
       return null;
    }
    return (
      <Switch>
            <Route path="/" render={(props) => {return (<Login updateAppStatus={this.updateStatus.bind(this)}/>)}} exact/>
            <Route path="/register" render={(props) => {return (<Register updateAppStatus={this.updateStatus.bind(this)} />)}} />
      </Switch>
    );
  }
  
  getHomePage(){
    if(!this.state.isLoggedin){
      return null;
    }
    return (
      <div className="container body">
            <div className="main_container">
              {this.state.isLoggedin ? <Sidebar username={this.state.username} /> : null}
              {this.state.isLoggedin ? <Topnav username={this.state.username} updateAppStatus={this.updateStatus.bind(this)} /> : null}
              <div className="right_col" role="main">
                <Switch>
                      <Route path="/" component={this.state.isLoggedin ? Home : Login} exact />
                      <Route path="/curPatients" render={(props) => {return (<CurPatients/>)}} />
                      <Route path="/disPatients" render={(props) => {return (<DisPatients/>)}} />
                      <Route path="/patient" render={(props) => {return (<ExamplePatient/>)}} />
                      <Route path="/addPatient" render={(props) => {return (<AddPatient props={props}/>)}} />
                      <Route path="/register" render={(props) => {return (<Register updateAppStatus={this.updateStatus.bind(this)} />)}} />
                      <Route path="/login" render={(props) => {return (<Login updateAppStatus={this.updateStatus.bind(this)}/>)}} exact/>
                </Switch>
              </div>
            </div>
          </div>
    )
  }

  render(){
    let LoginPage = this.getLoginPage();
    let HomePage = this.getHomePage();
    return (
      <BrowserRouter>
        <div className="nav-md">
          {LoginPage}
          {HomePage}
        </div>
      </BrowserRouter>

    );
  }
};
export default App;
ReactDOM.render(<App />, document.getElementById("app"));