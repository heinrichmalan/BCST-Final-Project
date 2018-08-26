import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

import Nav from "./components/Nav";
import Home from "./components/Home";
import Footer from "./components/Footer";
import DoctorLogin from "./components/DoctorLogin";
import PatientLogin from "./components/PatientLogin";
import FitbitAuth from "./components/FitbitAuth";
import Physician from "./components/Physician";
import Patient from "./components/Patient";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Nav />
        <div className="row d-flex wo-100 h-100">
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/physiotherapistLogin" component={DoctorLogin} exact />
            <Route path="/patientLogin" component={PatientLogin} exact />
            <Route path="/addFitbit" component={AddFitbit} />
            <Route path="/fitbitData" component={FitbitAuth} />
            <Route path="/physician" component={Physician} />
            <Route path="/patient" component={Patient} />
          </Switch>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
export default App;
ReactDOM.render(<App />, document.getElementById("app"));