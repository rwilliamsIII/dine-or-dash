var isAuthenticated = require("../config/authenticated");

module.exports = function(app) {

    // Renders the index page if logged in, else login page is loaded
    app.get("/", function(req, res) {
        // If the user already has an account send them to the main page
        if (req.user) {
          res.render("index");
        }
        res.render("signup");
    });
    // Renders the signup page
    app.get("/signup", function(req, res) {
      res.render("signup");
    });
    // Sends the user to the login page, if they are logged in then sends them to the main page
    app.get("/login", function(req, res) {
        // If the user already has an account send them to the main page
        if (req.user) {
          res.render("index");
        }
        res.render("login");
    });
    // Renders the main page if user is authenticated
    app.get("/index", isAuthenticated, function(req, res) {
        res.render("index")
    });
}