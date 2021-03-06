require("dotenv").load();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8001;
const app = express();

app.use(cors());

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(bodyParser.json({ limit: "20mb" }));
app.use(allowCrossDomain);

mongoose.connect("mongodb://mongo:27017/nucleus");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  require("./app/routes")(app, db);
  app.listen(port, () => {
    console.log("We are live on localhost:" + port);
  });
});
