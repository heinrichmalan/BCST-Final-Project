import React from "react";
import { Link } from "react-router-dom";

class Nav extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(evt) {
        evt.preventDefault;
        this.props.sessionStore.setLoggedIn(false);
    }

    render() {
        return (
            <div className="row d-flex">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
                    <Link className="navbar-brand m-0 p-0" to="/">
                        <div className="d-inline-flex align-items-center justify-content-center p-1 logo">
                            <strong>Physio Dashboard</strong>
                        </div>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                        <span className="nav-item nav-link active"><Link className="text-white" to="/">Home</Link> <span className="sr-only">(current)</span></span>
                        <span className="nav-item nav-link"><Link className="text-white" to="/about">About</Link></span>
                        <span className="nav-item nav-link"><Link className="text-white" to="/contact">Contact</Link></span>
                        { !this.props.sessionStore.loggedIn ? <span className="nav-item nav-link"><Link className="text-white" to="/login">Login</Link></span> : <span className="nav-item nav-link"><Link className="text-white" onClick={this.handleLogout} to="/">Logout</Link></span>}
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default Nav;