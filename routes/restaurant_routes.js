const express = require("express");
const router = express.Router();

const restaurant = require("../models/restaurant.js");


router.get("/", function(req, res) {
        res.render("index");
});



module.exports = router
