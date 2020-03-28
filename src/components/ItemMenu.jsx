import React, { Component } from "react";
import "./Menus.css";

class ItemMenu extends Component {
  state = {
    menu: "item", // Choices, item / menu
    selectedItem: ""
  };

  selectItem(item) {
    this.props.selectItem(item);
    this.props.changeMenu("none");
  }

  // Display the items that are available to craft
  renderItemChoices() {
    if (this.state.menu !== "item") return;
    let recipeChoices = [];
    this.props.items.forEach(recipe => {
      if (!recipeChoices.includes(recipe.itemName))
        recipeChoices.push(recipe.itemName);
    });

    return (
      <div className="items">
        {recipeChoices.map((item, index) => {
          return (
            <div
              className="item-box"
              key={index}
              onClick={() =>
                this.setState({ selectedItem: item, menu: "recipe" })
              }
            >
              {item}
            </div>
          );
        })}
      </div>
    );
  }

  // Displays the recipes of the item the user chose
  renderRecipeChoices() {
    if (this.state.menu !== "recipe") return;
    let recipes = [];
    this.props.items.forEach(recipe => {
      if (this.state.selectedItem === recipe.itemName) recipes.push(recipe);
    });

    return (
      <div className="items">
        {recipes.map(recipe => {
          return (
            <div
              className="item-box"
              key={recipe.recipeName}
              onClick={() => this.selectItem(recipe)}
              onMouseOver={() => this.setState({ hoveredRecipe: recipe })}
            >
              {recipe.recipeName}
            </div>
          );
        })}
        <div className="hovered-recipe">
          {this.state.hoveredRecipe && this.renderHover()}
        </div>
      </div>
    );
  }

  renderHover() {
    let item = this.state.hoveredRecipe;
    if (!item.hasOwnProperty("ingredientNames")) return;
    console.log("item is ", item);
    return (
      <>
        <h3>{item.recipeName}</h3>
        {item.ingredientNames.map((ingredient, index) => {
          return (
            <>
              <span key={index}>
                {item.ingredientAmounts[index]}x {ingredient}
              </span>
              <br></br>
            </>
          );
        })}
      </>
    );
  }

  // Renders Close Menu or Back button
  renderButtons() {
    if (this.state.menu === "item") {
      return (
        <button
          className="close-button btn btn-lg btn-danger"
          onClick={() => this.props.changeMenu("none")}
        >
          Close Menu
        </button>
      );
    } else if (this.state.menu === "recipe") {
      return (
        <button
          className="close-button btn btn-lg btn-danger"
          onClick={() => this.setState({ menu: "item", hoveredRecipe: {} })}
        >
          Back
        </button>
      );
    }
  }

  // Render a pop-up window to allow the user to select the main item to craft
  render() {
    return (
      <div className="menu">
        <div className="menu-inner">
          <h1>Select an Item</h1>

          {this.renderItemChoices()}
          {this.renderRecipeChoices()}

          {this.renderButtons()}

          <button
            className="new-recipe-button btn btn-lg btn-info"
            onClick={() => this.props.changeMenu("addItem")}
          >
            Add Recipe
          </button>
        </div>
      </div>
    );
  }
}

export default ItemMenu;
