import React, { Component } from "react";
import "./Output.css";
import format from "../format";

class Output extends Component {
  // Only render the amount if there is an item to have an amount
  renderAmount() {
    if (this.props.item !== "") {
      let amount = this.props.amount;
      if (isNaN(amount)) amount = 0;
      return (
        <input
          className="item-output"
          type="number"
          min="0"
          value={format(amount)}
          onChange={this.props.handleAmount}
        />
      );
    }
  }

  // Render text displaying the main item the user has chosen
  renderText() {
    if (this.props.item !== "") {
      return <span className="output-text">{this.props.item} per minute</span>;
    } else {
      return <span className="output-text">Select Recipe</span>;
    }
  }

  render() {
    return (
      <div className="output">
        {this.renderText()}
        {this.renderAmount()}
      </div>
    );
  }
}

export default Output;
