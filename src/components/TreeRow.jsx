import React, { Component } from "react";
import ItemMenu from "./ItemMenu";

class TreeRow extends Component {
  state = { selectMenu: false, recipes: [] };

  //
  handleSelectedItem = recipe => {
    let tree = this.props.tree;
    recipe.ingredientNames.forEach((ingredientName, index) => {
      tree.subTree.push({
        name: ingredientName,
        amount: tree.amount * recipe.ingredientAmounts[index], // Initial static value, will be kept up to date in app.js (updateTree)
        ratio: recipe.ingredientAmounts[index] / recipe.produced, // So it can calculate the amount each render
        subTree: []
      });
    });
    this.props.onChange(tree);
  };

  // Populate or unpopulate the tree when the user clicks on a row
  handleClick = name => {
    if (this.props.tree.subTree.length > 0) {
      this.props.tree.subTree = [];
      this.props.onChange(this.props.tree);
      return;
    }
    let itemName = this.props.tree.name;
    let recipes = this.props.recipes.filter(recipe => {
      if (recipe.itemName === itemName) return recipe;
      return null;
    });
    this.setState({ selectMenu: true, recipes: recipes });
  };

  // Render menu for user to choose the recipe they want it we need to
  renderSelectMenu() {
    if (this.state.selectMenu) {
      return (
        <ItemMenu
          changeMenu={() => this.setState({ selectMenu: false })}
          items={this.state.recipes}
          selectItem={item => this.handleSelectedItem(item)}
        />
      );
    }
  }

  // Renders a single row in the tree, calculating indention through margin, and adding text and click functionality
  renderItem() {
    const { amount, name } = this.props.tree;
    const style = {
      marginLeft: 5 * this.props.level + "%"
    };
    return (
      <div
        className="item-block"
        style={style}
        onClick={() => this.handleClick(name)}
      >
        {amount} {name}
      </div>
    );
  }

  // Recursively calls TreeRow for any children that need to be expanded
  renderChildren() {
    const tree = this.props.tree;
    if (tree.subTree.length > 0) {
      return tree.subTree.map((item, index) => {
        return (
          <TreeRow
            key={index}
            tree={item}
            level={this.props.level + 1}
            onChange={() => {
              this.props.onChange(this.props.tree);
            }}
            recipes={this.props.recipes}
          />
        );
      });
    }
  }

  render() {
    return (
      <>
        {this.renderItem()}
        {this.renderChildren()}
        {this.renderSelectMenu()}
      </>
    );
  }
}

export default TreeRow;
