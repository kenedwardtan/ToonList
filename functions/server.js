const express = require("express");
const serverless = require("serverless-http");
const bodyparser = require("body-parser");
const hbs = require("hbs");
const mongoose = require("mongoose");
const session = require("express-session");
const handlebars = require("express-handlebars");

const app = express();

// MongoDB connection
mongoose.Promise = global.Promise;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ToonList";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + '/views/partials');
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: __dirname + '/views/partials/'
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
  secret: "secret key",
  resave: true,
  saveUninitialized: true,
  name: "ToonList"
}));

// Routes
const route = require('../routes/route');
app.use("/", route);
app.use(express.static(__dirname + "/public"));

// Instead of app.listen()
module.exports.handler = serverless(app);
