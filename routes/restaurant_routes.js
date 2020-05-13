const db = require("../models");
const router = express.Router();
require('dotenv').config();


        router.get("/", function(req, res) {
                res.render("index");
        });
        // Sending protected api keys to client side
        router.get("/api/keys", function(req, res) {
                keys = [];
                keys.push(process.env.yelp);
                keys.push(process.env.maps);
                res.json(keys);
        });
        router.post("/api/restaurants", function(req, res){
                db.Restaurant.create({
                        id: req.body.id
                }).then(function(dbRestaurant) {
                        res.json(dbRestaurant);
                        console.log(dbRestaurant);
            });
        });

module.exports = router;
