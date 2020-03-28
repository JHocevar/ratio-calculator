import React, { Component } from "react";
import "./Menus.css";
import FloatingLabel from "floating-label-react";
import "floating-label-react/styles.css";

class AddMenu extends Component {
  // Initialize the the value of each input box to empty strings
  state = {
    name: "",
    produced: "",
    time: "",
    building: "",
    itemChoices: [{ name: "", amount: "" }],
    isAlt: false,
    altName: ""
  };

  // Name of new item
  handleName = event => {
    this.setState({ name: event.target.value });
  };

  // Amount produced each operation of new item
  handleAmount = event => {
    this.setState({ produced: event.target.value });
  };

  // Time to craft new item
  handleTime = event => {
    this.setState({ time: event.target.value });
  };

  // Handles changes to the name of the building
  handleBuilding = event => {
    this.setState({ building: event.target.value });
  };

  // Handles form input boxes for new item ingredients
  handleItems = (event, id, key) => {
    let items = this.state.itemChoices;
    if (key === "name") items[event.target.id]["name"] = event.target.value;
    else if (key === "amount")
      items[event.target.id]["amount"] = event.target.value;
    this.setState({ itemChoices: items });
  };

  // Handles changes to the isAlt button
  handleAlternate = event => {
    this.setState({ isAlt: !this.state.isAlt });
  };

  // Handles changes the alternative name
  handleAlt = event => {
    this.setState({ altName: event.target.value });
  };

  // Ads input boxes for another item in the ingredient section
  addItem = () => {
    let items = this.state.itemChoices;
    items.push({ name: "", amount: "" });
    console.log(items);
    this.setState({ itemChoices: items });
  };

  // Removes an item (both name and amount) from the list
  removeItem = () => {
    let items = this.state.itemChoices;
    if (items.length < 1) return; // 0 ingredients are possible for ore operations and other base materials
    items.pop();
    this.setState({ itemChoices: items });
  };

  // Validates and submits the item to be added to the database
  handleSubmit = event => {
    let ingredients = this.state.itemChoices;

    let items = [];
    let amounts = [];
    console.log("items", items);
    Object.keys(ingredients).forEach(itemIndex => {
      items.push(ingredients[itemIndex].name);
      amounts.push(ingredients[itemIndex].amount);
    });

    // Set the recipe name to the altName if it exists, otherwise set it the item name itself
    let recipeName;
    if (this.state.isAlt) recipeName = this.state.altName;
    else recipeName = this.state.name;

    let newItem = {
      itemName: this.state.name,
      produced: this.state.produced,
      time: this.state.time,
      recipeName: recipeName,
      building: this.state.building,
      ingredientNames: items,
      ingredientAmounts: amounts
    };

    if (
      !this.props.recipes.some(item => {
        return item.recipeName === newItem.recipeName;
      })
    ) {
      this.props.postItem(newItem);
    }

    event.preventDefault();
    this.props.changeMenu("changeItem");
  };

  // Validates the data entered prior to submit
  isValidData() {
    let { name, produced, time } = this.state;
    if (name === "" || produced === "" || time === "") return false;
    return true;
  }

  // Renders add and subtract buttons for crafting ingredients
  renderItemButtons() {
    return (
      <React.Fragment>
        <button type="button" onClick={this.removeItem}>
          -
        </button>
        <button type="button" onClick={this.addItem}>
          +
        </button>
      </React.Fragment>
    );
  }

  // Renders the list of items used as ingredients (right hand side)
  // by mapping the array to 2 input fields each
  renderItemBoxes() {
    let id = -1;
    return this.state.itemChoices.map((key, value) => {
      id++;
      let placeholderName = "Item " + (id + 1) + " name";
      let placeholderAmount = "Item " + (id + 1) + " amount";
      return (
        <React.Fragment key={id}>
          <FloatingLabel
            id={id}
            placeholder={placeholderName}
            type="text"
            value={this.state.itemChoices[id].name}
            onChange={event => this.handleItems(event, id, "name")}
          ></FloatingLabel>
          <FloatingLabel
            id={id}
            placeholder={placeholderAmount}
            type="number"
            value={this.state.itemChoices[id].amount}
            onChange={event => this.handleItems(event, id, "amount")}
          ></FloatingLabel>
        </React.Fragment>
      );
    });
  }

  // Adds the add and subtract buttons to the bottom of the ItemBoxes render
  renderItems() {
    return (
      <>
        <div className="ingredient-box">{this.renderItemBoxes()}</div>
        {this.renderItemButtons()}
      </>
    );
  }

  // Renders an input box for alternative name only if the is Alt button is checked
  renderAltName() {
    if (this.state.isAlt) {
      return (
        <FloatingLabel
          id="9"
          placeholder="Alternative recipe name* (must be unique)"
          type="text"
          value={this.state.altName}
          onChange={this.handleAlt}
        ></FloatingLabel>
      );
    }
  }

  render() {
    return (
      <div className="menu">
        <div className="menu-inner">
          <span>Describe the item you wish to add</span>
          <br></br>

          <form className="input-form" onSubmit={this.handleSubmit.bind(this)}>
            <div className="container-fluid"></div>
            <div className="row">
              <div className="col-6">
                {/* Left half is for the required information about the new item*/}
                <FloatingLabel
                  id="1"
                  placeholder="Item name*"
                  type="text"
                  value={this.state.name}
                  onChange={this.handleName}
                ></FloatingLabel>
                <FloatingLabel
                  id="2"
                  placeholder="Produced per operation*"
                  type="number"
                  value={this.state.produced}
                  onChange={this.handleAmount}
                ></FloatingLabel>
                <FloatingLabel
                  id="3"
                  placeholder="Time to craft*"
                  type="number"
                  value={this.state.time}
                  onChange={this.handleTime}
                ></FloatingLabel>
                <FloatingLabel
                  id="4"
                  placeholder="Building"
                  type="text"
                  value={this.state.building}
                  onChange={this.handleBuilding}
                ></FloatingLabel>
                <div>
                  <label className="alternate">Is Alternate Recipe</label>
                  <input
                    className="alternate"
                    type="checkbox"
                    value={this.state.isAlt}
                    onChange={this.handleAlternate}
                  />
                </div>
                {this.renderAltName()}
              </div>
              <div className="col-6">
                {/* Right half is for the optional and variable amount of items required to craft */}
                {this.renderItems()}
              </div>
            </div>
            {/* Submit button at the bottom */}
            <input
              className="new-recipe-button btn btn-lg btn-success"
              type="submit"
              value="Confirm"
              disabled={!this.isValidData()}
            />
          </form>

          {/* Cancel button */}
          <button
            className="close-button btn btn-lg btn-danger"
            onClick={() => this.props.changeMenu("changeItem")}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

export default AddMenu;
