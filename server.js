const express = require("express");
const timeout = require("connect-timeout")

const PORT = process.env.PORT || 5000;

const app = express();

const db = require("./models");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./routes/restaurant_routes.js")(app);

app.use(timeout(15000));
app.use(haltOnTimeout);

function haltOnTimeout(req, res, next) {
    if (!req.timedout) next();
  }

db.sequelize.sync({ force: true }).then(function(){
app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
    });
});