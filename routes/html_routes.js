var isAuthenticated = require("../config/authenticated");
var path = require("path");

module.exports = function(app) {

    // Renders the index page if logged in, else login page is loaded
    app.get("/", function(req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
          res.redirect("/index");
        }
        res.render("signup");
    });
    // Sends the user to the login page, if they are logged in then sends them to the main page
    app.get("/login", function(req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
          res.redirect("/index");
        }
        res.render("login");
    });
    // Renders the main page if user is authenticated
    app.get("/index", isAuthenticated, function(req, res) {
        res.render("index");
    });
}