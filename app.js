//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connect(
  "mongodb+srv://admin-saurabh:Test-123@cluster0.kvavfuf.mongodb.net/todolistDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = {
  name: String,
};

const ItemModel = mongoose.model("Item", itemsSchema);

const item1 = new ItemModel({
  name: "Welcome to your todolist !",
});

const item2 = new ItemModel({
  name: "Hit the + button to add a new item",
});

const item3 = new ItemModel({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  const day = date.getDate();
  ItemModel.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      ItemModel.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success !!!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new ItemModel({
    name: itemName,
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  ItemModel.findByIdAndRemove(checkedItemId, (err) => {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
