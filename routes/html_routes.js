var isAuthenticated = require("../config/authenticated");
const db = require("../models");
require('dotenv').config();
let Handlebars = require("handlebars");
Handlebars.registerPartial('card', '{{card}}');

module.exports = function(app) {

    // Renders the index page if logged in, else login page is loaded
    app.get("/", isAuthenticated, function(req, res) {
        res.render("index");
    });

    // Sends the user to the login page, if they are logged in then sends them to the main page
    app.get("/login", function(req, res) {
        // If the user already has an account send them to the main page
        if (req.user) {
          res.render("index");
        }
        res.render("login");
    });

    // Renders the main page if user is authenticated, else login page is loaded
    app.get("/index", isAuthenticated, function(req, res) {
        res.render("index")
    });

    // Sends the user to the login page
    app.get("/login/static", function(req, res) {
      res.render("login");
    });

    // Renders the signup page
    app.get("/signup/static", function(req, res) {
      res.render("signup");
    });

    // Renders the liked page
    app.get("/liked", isAuthenticated, function(req, res) {
      res.render("liked");
    });

    // Renders the liked page restaurants
    app.get("/liked/restaurants", function(req, res) {
      db.Restaurant.findAll({where: {liked: true}}).then(function(restaurants) {
        res.send(restaurants);
      }).error(function (err) {
        console.log("Error:" + err);
      }); 
    });
    
    // Displays the card template handlebar
    app.get("/api/card/:id", function(req, res) {
      var id = req.params.id
      db.Restaurant.findOne({where: {resID: id}}).then(function(restaurants) {
        var restaurant = restaurants;
        var id = restaurant.id;
        var name = restaurant.name;
        var yelp = restaurant.yelp_url;
        var imageURL = restaurant.pic_url;
        var rating = restaurant.rating;
        var info = {restaurant: {id, name, yelp, imageURL, rating}};
        res.send(info);
      }).error(function (err) {
        console.log("Error:" + err);
      });             
    });

}