import React from "react";
import { Link } from "react-router-dom";

import PatientGraph from '../components/PatientGraph'
import PatientGoal from '../components/PatientGoal'

class ExamplePatient extends React.Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { 
      content : "Graph",
    };
  }


    render() {
        return (
            <div>
              <div className="btn-group patient-toggle">
                <button type="button" className="btn btn-primary"
                onClick={() => this.setState({content: 'Graph'})}
                >Summary</button>
                <button type="button" className="btn btn-primary" 
                onClick={() => this.setState({content: 'Graph'})}
                >Graphs</button>
                <button type="button" className="btn btn-primary" 
                onClick={() => this.setState({content: 'Goal'})}
                >Goals</button>
              </div>
              <div className="">
                <div className="page-title">
                  <div className="title_left">
                    <h3>Elizabeth Smith</h3>
                    <p>MRN: 88124213</p>
                    <p><i>Last check up: 30/02/2018</i></p>
                  </div>
                </div>
                <div className="clearfix"></div>
                </div>

              {
                (this.state.content === "Graph")
                    ? <PatientGraph/>
                    : null
              }

              {
                (this.state.content === "Goal")
                    ? <PatientGoal/>
                    : null
              }

            </div>
        )
    }
}

export default ExamplePatient;