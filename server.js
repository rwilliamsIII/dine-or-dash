const express = require("express");

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


db.sequelize.sync({ force: true }).then(function(){
app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
    });
});