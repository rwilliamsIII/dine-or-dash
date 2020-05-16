const db = require("../models");
require('dotenv').config();

module.exports = function(app){
        app.get("/", function(req, res) {
                res.render("index");
        });
        // Sending protected api keys to client side
        app.get("/api/keys", function(req, res) {
                keys = [];
                keys.push(process.env.yelp);
                keys.push(process.env.maps);
                res.json(keys);
        });
        app.post("/api/restaurants", function(req, res){
                db.Restaurant.create({
                        id: req.body.id
                }).then(function(dbRestaurant) {
                        res.json(dbRestaurant);
                        console.log(dbRestaurant);
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
        app.update("/api/resturants/:id", function(req, res) {
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
