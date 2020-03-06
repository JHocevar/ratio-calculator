import React, { Component } from "react";
import Navbar from "./components/Navbar";
import Output from "./components/Output";
import Input from "./components/Input";
import AdditionalOutputs from "./components/AdditionalOutputs";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  state = { test: 1 };
  render() {
    return (
      <div className="container-fluid">
        <Navbar />
        <br></br>
        <div className="row">
          <div className="col-5 ">
            <Output />
            <br></br>
            <AdditionalOutputs />
          </div>
          <div className="col-2">
            <button></button>
          </div>
          <div className="col-5">
            <Input />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
