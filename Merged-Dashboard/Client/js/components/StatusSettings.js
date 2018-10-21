import React from "react";
import { Link } from "react-router-dom";

class StatusSettings extends React.Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      placeholder: "Loading...",
    };
  }
    changePatientStatus(mrn, is_archived) {
      let endpoint = '/api/patient/changePatientStatus';
      let patientInfo = {
        'mrn': mrn,
        'is_archived': is_archived
      }
      let option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {patientInfo}
      }
      fetch(endpoint, option).then(
        res => {
          if (res.status !== 200) {
            return "Somethong goes wrong.";
          }
          return res.json();
        }

      )
    }
    render() {
        return (
            <div>
              <div className="x_panel">
                <div className="x_title">
                  <h2>Change Patient Status</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                {
                  this.props.archived
                  ? <div className="btn btn-success" 
                    onClick={() => { if (window.confirm('Are you sure you wish to re-admit this patient?'))
                    changePatientStatus(this.props.match.params.MRN, this.props.match.params.is_archived)
                       } }>
                      Re-admit Patient</div>
                  : <div className="btn btn-success"
                  onClick={() => { if (window.confirm('Are you sure you wish to archive this patient?'))
                    // this.onCancel();
                    changePatientStatus(this.props.match.params.MRN, this.props.match.params.is_archived)
                       } }>
                      Archive Patient</div>
                }
                  
                </div>
              </div>
            </div>
        )
    }
}

export default StatusSettings;