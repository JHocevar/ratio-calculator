import React, { Component } from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.css";

class Navbar extends Component {
  render() {
    return (
      <div className="row" id="navbar">
        <div className="col-2 align-self-center"></div>
        <div className="col-2 align-self-center"></div>
        <div className="col-4">
          <h1>Ratio Calculator!</h1>
        </div>
        <div className="col-1 align-self-center"></div>
        <div className="col-3"></div>
      </div>
    );
  }
}

export default Navbar;
