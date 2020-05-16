// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
const timeout = require("connect-timeout");
const PORT = process.env.PORT || 5000;
let db = require("./models");
const exphbs = require("express-handlebars");
var flash = require("connect-flash");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Allows connection to JawsDB without timing out
function haltOnTimeout(req, res, next) {
    if (!req.timedout) next();
}
app.use(timeout(15000));
app.use(haltOnTimeout);

// Setting up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Requiring our routes
require("./routes/html_routes")(app);
require("./routes/restaurant_routes")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});