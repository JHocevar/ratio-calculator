import React, { Component } from "react";
import TreeRow from "./TreeRow";
import "./TreeView.css";

class TreeView extends Component {
  // Renders only the top level item, the one the user chose
  renderItem() {
    const { tree } = this.props;
    let amount = tree.amount;
    let result = "";
    if (tree === undefined) return;
    if (amount !== 0) {
      if (isNaN(amount)) amount = 0;
      result += amount += " ";
    }
    if (tree.name !== "") {
      result += tree.name + "s";
    }

    return result;
  }

  // Stars off the recursive call to TreeRow
  renderTree() {
    let tree = this.props.tree;
    return tree.subTree.map((item, index) => {
      return (
        <TreeRow
          key={index}
          tree={item}
          level={1}
          onChange={() => {
            this.props.onChange(this.props.tree);
          }}
          recipes={this.props.recipes}
        />
      );
    });
  }

  // Render the entire tree block
  render() {
    return (
      <div className="tree-view">
        <h1>Crafting Tree</h1>
        <div className="tree-items">
          <div className="main-item">{this.renderItem()}</div>
          {this.renderTree()}
        </div>
      </div>
    );
  }
}

export default TreeView;
