const db = require("../models");
require('dotenv').config();
let passport = require("../config/passport");

module.exports = function(app) {
        // Route to check the login credentials
        app.post("/login", passport.authenticate("local"), function(req, res) {
                res.json(req.user);
        });
        // Route to create a user from the sign-up page
        app.post("/signup", function(req, res) {
                db.User.create({
                  username: req.body.username,
                  password: req.body.password
                })
                .then(function() {
                    res.redirect(307, "/login");
                })
                .catch(function(err) {
                    res.status(401).json(err);
                });
        });
        // Renders the index page
        // May get removed with passport functionality --- Tim M.
        app.get("/", function(req, res) {
                res.render("index");
        });
        // Renders the login page
        // May get removed with passport functionality --- Tim M.
        app.get("/login", function(req, res) {
                res.render("login");
        });
        // Renders the signup page
        // I think we will be keeping this --- Tim M.
        app.get("/signup", function(req, res) {
                res.render("signup");
        });
        // Sending protected api keys to client side
        app.get("/api/keys", function(req, res) {
                keys = [];
                keys.push(process.env.yelp);
                keys.push(process.env.maps);
                res.json(keys);
        });
        // app.post("/api/restaurants", function(req, res){
        //         db.Restaurant.create({
        //                 id: req.body.id
        //         }).then(function(dbRestaurant) {
        //                 res.json(dbRestaurant);
        //                 console.log(dbRestaurant);
        //             });
        //         });
}
        

