const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");

// mongodb conection
mongoose.connect("mongodb://localhost/book-site");
const db = mongoose.connection;
// mongodb error
db.on("error", console.error.bind(console, "connection error:"));


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + "/public"));

// SESSION midalware
app.use(session({
  secret: "the only required argument",
  resave: true, // force the session to be saved in the session store
  saveUninitialized: false // (to save or not to save) an uninitialized/new session in the store
}));

// make user ID available in templates
app.use(function(req, res, next) {
   res.locals.currentUser = req.session.userId;
   next();
});

// view engine setup
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// include routes
const routes = require("./routes/index");
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(process.env.PORT, process.env.ID, function () {
  console.log("Express app listening on port 3000| on cloud 9");
});
