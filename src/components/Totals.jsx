import React, { Component } from "react";

class Totals extends Component {
  render() {
    return (
      <div className="output">
        <h1>Totals</h1>
        {Object.keys(this.props.items).map((item, index) => {
          return (
            <div key={index}>
              {item}:{this.props.items[item]}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Totals;
