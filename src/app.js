import React, { Component } from "react";
import Navbar from "./components/Navbar";
import Output from "./components/Output";
import TreeView from "./components/TreeView";
import Totals from "./components/Totals";
import ItemMenu from "./components/ItemMenu";
import AddMenu from "./components/AddMenu";
import AdditionalOutputs from "./components/AdditionalOutputs";
import format from "./format";
import "./app.css";

const axios = require("axios").default;
const URL = "https://ratio-calculator-backend.herokuapp.com//api/recipes";

class App extends Component {
  // Initialize all state values to empty
  state = {
    menu: "none",
    recipes: [], // List of all recipes obtainted from the database
    tree: { name: "", amount: 0, recipe: {}, subTree: [] }, // Keeps track of the recursive table of recipes the user has chosen
    totals: {},
  };

  // Returns an arrray with all the recipes from the database
  getAllRecipes = async () => {
    let url = URL + "/all";
    let res = await axios.get(url, {});
    return await res.data;
  };

  // Sets the state to all the recipes retrieved from getAllRecipes
  updateRecipes = () => {
    this.getAllRecipes().then((data) => this.setState({ recipes: data }));
  };

  // Returns recipes for a given itemName
  getResponse = async (itemName) => {
    var url = URL + "/" + itemName;
    return axios
      .get(url, {})
      .then((data) => {
        console.log("Recieved data", data);
        return data;
      })
      .catch((error) => {
        console.log("Error is", error);
      });
  };

  // Posts item to the database
  postResponse = async (item) => {
    var url = URL + "/" + item.name;
    console.log("posting item", item);
    axios
      .post(url, item)
      .then((response) => {
        // When we get the responce back,
        console.log("Recipe added successfully");
        let recipes = this.state.recipes;
        recipes.push(item);
        this.setState({ recipes });
      })
      .catch((error) => console.log(error));
  };

  addItemRecursive(subTree, totals) {
    subTree.forEach((item) => {
      if (item.subTree.length > 0)
        totals = this.addItemRecursive(item.subTree, totals);
      else {
        if (!totals[item.name]) totals[item.name] = item.amount;
        else totals[item.name] += item.amount;
      }
    });
    return totals;
  }

  // Recursively update the branch of a main ingredient of the tree, updating amounts
  updateTree(tree) {
    let amount = tree.amount;
    if (tree.subTree.length === 0) return;
    tree.subTree.forEach((item) => {
      item.amount = item.ratio * amount; // Update the amount for the item
      if (item.subTree.length > 0)
        // Then update its children if it has any,
        //the amount must be updated first, as it is used to calculate its children
        this.updateTree(item);
    });
  }

  // Update the totals state variable by recursively diving into the tree and getting the totals
  updateTotals(tree) {
    let totals = {};
    tree.subTree.forEach((item) => {
      if (item.subTree.length > 0) {
        totals = this.addItemRecursive(item.subTree, totals);
      } else {
        if (!totals[item.name]) totals[item.name] = item.amount;
        else totals[item.name] += item.amount;
      }
    });
    this.setState({ totals });
  }

  // Changes the menu to the argument provided, if it is valid
  changeMenu = (newMenu) => {
    if (newMenu !== "changeItem" && newMenu !== "addItem" && newMenu !== "none")
      return; // We cannot change to a menu that does not exist
    this.setState({ menu: newMenu });
  };

  // Handles changes in the amount of the selected item we want to produce
  handleSelectedAmount = (event) => {
    let tree = this.state.tree;
    let newAmount = format(event.target.value);
    tree.amount = newAmount;
    if (tree.name !== "") {
      // Because the user has already selected the recipe to use, we can update
      // the amounts of each item required each time the amount of the main item is changed
      tree.subTree.forEach((item, index) => {
        item.amount = format(
          (tree.recipe.ingredientAmounts[index] * newAmount) /
            tree.recipe.produced
        );
        console.log("set amount of", item, "to", item.amount);
        this.updateTree(item); // Update the entire subtree for each main ingredient
      });
    }
    this.updateTotals(tree);
    this.setState({ tree });
  };

  // Handles changes to the current item we want to produce
  handleSelectedItem = (item) => {
    let tree = this.state.tree;
    tree.name = item.itemName;
    tree.recipe = item;
    // Create the initial subtree with the ingredients of the main recipe
    tree.subTree = item.ingredientNames.map((name, index) => {
      let newItem = {};
      newItem.name = name;
      newItem.amount = item.ingredientAmounts[index] * tree.amount;
      newItem.subTree = [];
      return newItem;
    });
    this.setState({ tree });
  };

  // Render Popup window for selecting an item
  renderItemMenu() {
    if (this.state.menu === "changeItem") {
      return (
        <ItemMenu
          changeMenu={this.changeMenu}
          items={this.state.recipes}
          selectItem={this.handleSelectedItem}
        />
      );
    }
  }

  // Render Popup window for adding an item to the database
  renderAddMenu() {
    if (this.state.menu !== "addItem") return;
    return (
      <AddMenu
        changeMenu={this.changeMenu}
        postItem={this.postResponse}
        recipes={this.state.recipes}
      />
    );
  }

  // Retrieve the recipes from the databse when we load up
  componentDidMount() {
    this.updateRecipes();
  }

  render() {
    return (
      <div className="container-fluid">
        <Navbar />
        <br></br>
        <div className="row">
          <div className="col-5 ">
            {/* Leftmost 5 columns */}
            <Output
              item={this.state.tree.name}
              amount={this.state.tree.amount}
              handleAmount={this.handleSelectedAmount}
            />
            <br></br>
          </div>
          <div className="col-2">
            {/* Middle 2 columns */}
            <div className="input-button">
              <button
                className="btn btn-lg btn-primary"
                onClick={() => this.changeMenu("changeItem")}
              >
                Change Recipe
              </button>
              <br></br>
              <br></br>
            </div>
          </div>
          <div className="col-5">
            {/* Rightmost 5 columns */}
            <AdditionalOutputs />
          </div>
        </div>
        <div className="row text-center">
          <div className="col-10 offset-1">
            <TreeView
              tree={this.state.tree}
              onChange={(recievedTree) => {
                console.log(
                  "recieved the updated tree",
                  JSON.parse(JSON.stringify(recievedTree))
                );
                this.setState({ tree: recievedTree });
                this.updateTotals(this.state.tree);
              }}
              recipes={this.state.recipes}
            />
            <br></br>
            <Totals items={this.state.totals} />
          </div>
        </div>
        {/* Render popup windows over the entire screen*/}
        {this.renderItemMenu()}
        {this.renderAddMenu()}
      </div>
    );
  }
}

export default App;
