const db = require("../models");
require('dotenv').config();
let passport = require("../config/passport");
let Handlebars = require("handlebars");
Handlebars.registerPartial('card', '{{card}}');

module.exports = function(app) {
        
        // Route to check the login credentials
        app.post("/api/login", passport.authenticate("local"), function(req, res) {
                res.json(req.user);
        });

        // Logs the user out to the login page
        app.get("/logout", function(req, res) {
                req.logout();
                res.redirect("/login");
        });

        // Route to create a user from the sign-up page
        app.post("/api/signup", function(req, res) {
                db.User.create({
                        username: req.body.username,
                        password: req.body.password
                })
                .then(function() {
                        res.redirect(307, "/api/login");
                })
                .catch(function(err) {
                        res.status(401).json(err);
                });
        });

        // Sending protected api keys to client side
        app.get("/api/keys", function(req, res) {
                keys = [];
                keys.push(process.env.yelp);
                keys.push(process.env.maps);
                res.json(keys);
        });

        app.post("/api/restaurants", function(req, res){
                console.log(req);
                db.Restaurant.create({
                        resID: req.body.id,
                        name: req.body.name,
                        user: req.user.username,
                        pic_url: req.body.picURL,
                        yelp_url: req.body.yelp,
                        rating: req.body.rating,
                        liked: true,
                        favorited: false
                }).then(function(newRestaurant) {
                        res.json(newRestaurant);
                    });
        });
        
        // Creates a new user in the Users table
        app.post("/api/users", function(req, res){
                db.User.create({
                        username: req.body.username,
                        password: req.body.password
                }).then(function(newUser){
                        res.json(newUser);
                        console.log(newUser);
                });
        });

        app.delete("/api/restaurants/:id", function(req, res) {
                db.Restaurant.delete({
                        id: req.body.id,
                        name: req.body.name
                }).then(function(newRestaurant) {
                        res.json(newRestaurant);
                        console.log(newRestaurant);
                        (err => res.status(500).json(err));
                
                 });
        });

        app.put("/api/resturants/:id", function(req, res) {
                db.Restaurant.update({
                        id: req.body.id,
                        name: req.body.name
                }).then(function(newRestaurant) {
                        res.json(newRestaurant);
                        console.log(newRestaurant);
                        (err => res.status(500).json(err));

                })
        });
}
        

