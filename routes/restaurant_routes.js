const db = require("../models")

module.exports = function(app){
        app.get("/", function(req, res) {
                res.render("index");
        });
        
        app.post("/api/restaurants", function(req, res){
                db.Restaurant.create({
                        id: req.body.id
                }).then(function(dbRestaurant) {
                        res.json(dbRestaurant);
                        console.log(dbRestaurant);
            });
        });

}
