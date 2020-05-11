var alias;
var id;
var restDiv = $(".restaurants")
var pos;
var yelp;
var maps;

// Returns one random restaurant for the city
function searchRestaurants() {

    var offset = Math.floor(Math.random() * 1599);
    var city = $("#city").val().trim();
    var searchURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${city}&categories=restaurants&limit=1&offset=${offset}`;

    // If a city does not have 1600 restaurants, it will re-roll the offset and try again.
    $.ajax({
        statusCode: {
            400: function() {
            searchRestaurants();
            }
        },
        statusCode: {
            404: function() {
            searchRestaurants();
            }
        },
        url: searchURL,
        method: "GET",
        headers: {
            "Authorization": yelp,
        }
    })
    .then(function(res){
        console.log(res);

        alias = res.businesses[0].alias;
        id = res.businesses[0].id;
        var likeBtn = $("<button>").text("Dine!");
        var dislikeBtn = $("<button>").text("Dash!");

        likeBtn.on("click", function(){
            sendID();
        });

        $("<h3>").text("Restaurant ID: " + id).appendTo(restDiv)
        $("<h3>").text("Restaurant alias: " + alias).appendTo(restDiv)
        likeBtn.appendTo(restDiv)
        dislikeBtn.appendTo(restDiv)

        restaurantPhotos();
        getReviews();
        
    })    
} 

// Returns a city by using the id stored in mysql
// Will want to pull the id within this function likely
function searchRestaurantsByID() {

    var searchidURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}`;
    
    $.ajax({
        url: searchidURL,
        method: "GET",
        headers: {
            "Authorization": yelp,
        }
    })
    .then(function(res){
        console.log(res);
    })    
} 

function restaurantPhotos() {

    var photoURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${alias}`;

    $.ajax({
        url: photoURL,
        method: "GET",
        headers: {
            "Authorization": yelp,
        }
    })
        .then(function(res){
            console.log(res);
        })
} 

function getReviews() {
    var reviewsURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${alias}/reviews`;
    $.ajax({
        url: reviewsURL,
        method: "GET",
        headers: {
            "Authorization": yelp,
        }
    })
        .then(function(res){
            console.log(res);
        })
} 

// Sends the id from one of the previous yelp calls to the database, so it can be sent back to display the favorites page
function sendID() {
    $.ajax("/api/restaurants/" + id, {
    type: "POST",
    }).then(
    function() {
        console.log("Restaurant id: ", id);
    });
}

// Gets the keys from server side
function getKeys() {
    $.ajax("/api/keys", {
    type: "GET",
    }).then(
    function(res) {
        yelp = res[0];
        maps = res[1];
    });
}

// Gets the users current location for use to display nearby options
function geolocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    console.log(pos);
    console.log(pos.lat);
    })
}

// Sets up the ability to use geolocation from google maps
function setupGeolocation() {

    var googleMapsURL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=${maps}`;
    
    $.ajax({
        url: googleMapsURL,
        method: "GET",
    })
    .then(function(res){
        geolocation();
    })    
} 

$( document ).ready(function() {

    getKeys();

    $("#search").on("click", function(event) {
        event.preventDefault();
        searchRestaurants();
        $("#city").val("");
    })

});