import React, { Component } from "react";
import "./Input.css";

class Input extends Component {
  render() {
    return (
      <div className="input">
        <span>Inputs</span>
        <div className="item">Item Placeholder 1</div>
        <div className="item">Item Placeholder 2</div>
        <div className="item">Item Placeholder 3</div>
      </div>
    );
  }
}

export default Input;
