"use strict";

var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.Node_Env || "development";
var config = require(__dirname + "/../config/config.js")[env];
var db = {};

if (config.use_env_variable){
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;