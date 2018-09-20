import React from "react";
import { Link } from "react-router-dom";

class PatientSidebar extends React.Component {

  render() {
      return (
        <div>
          <hr id="sidebar-hr" ></hr>
          <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
          <div className="menu_section">
            <ul className="nav side-menu">
            <li>
              <Link to="patient">
              <i class="fa fa-bar-chart-o"></i> Patient Data 
              </Link>
              </li>
              <li><Link to="patient-goal"><i class="fa fa-table"></i> Goals </Link>
                  </li>

            </ul>
          </div>
        </div>
        </div>
        
      )
    
  }
}
export default PatientSidebar;