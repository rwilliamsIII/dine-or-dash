// Initializing variables
var alias;
var id;
var name_biz;
var picURL;
var restDiv = $(".restaurants")
var pos;
var yelp;
var maps;
var lat;
var long;

// Returns one random restaurant for the city
function searchRestaurants() {

    var city = $("#city").val().trim();
    var lengthURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${city}&categories=restaurants`;

    // Gets length of response
    $.ajax({
        url: lengthURL,
        method: "GET",
        headers: {
            "Authorization": yelp,
        }
    })
    .then(function(res){

        var offset = Math.floor(Math.random() * res.businesses.length);
        var searchURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${city}&categories=restaurants&limit=1&offset=${offset}`;

        $.ajax({
            url: searchURL,
            method: "GET",
            headers: {
                "Authorization": yelp,
            }
        })
        .then(function(res){
            console.log(res);
            name_biz = res.businesses[0].name;
            alias = res.businesses[0].alias;
            id = res.businesses[0].id;
            picURL = res.businesses[0].image_url;

            var likeBtn = $("<button>").text("Dine!");
            var dislikeBtn = $("<button>").text("Dash!");

            likeBtn.on("click", function(){
                sendInfo();
            });

            $("<h3>").text("Restaurant ID: " + id).appendTo(restDiv)
            $("<h3>").text("Restaurant alias: " + name_biz).appendTo(restDiv)
            likeBtn.appendTo(restDiv)
            dislikeBtn.appendTo(restDiv)

            restaurantPhotos();
            getReviews();
            
        })    
    })
}

// Returns one random restaurant near the coordinates of the user
function nearbyRestaurants() {

    var lengthURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&categories=restaurants`

    $.ajax({
        url: lengthURL,
        method: "GET",
        headers: {
            "Authorization": yelp,
        }
    })
    .then(function(res){
        var offset = Math.floor(Math.random() * res.businesses.length);
        var searchCoordinatesURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&categories=restaurants&limit=1&offset=${offset}`;
    
        $.ajax({
            url: searchCoordinatesURL,
            method: "GET",
            headers: {
                "Authorization": yelp,
            }
        })
        .then(function(res2){
            console.log(res2);
            name_biz = res2.businesses[0].name;
            alias = res2.businesses[0].alias;
            id = res2.businesses[0].id;
            picURL = res.businesses[0].image_url;

            var likeBtn = $("<button>").text("Dine!");
            var dislikeBtn = $("<button>").text("Dash!");
    
            likeBtn.on("click", function(){
                sendInfo();
            });
    
            $("<h3>").text("Restaurant ID: " + id).appendTo(restDiv)
            $("<h3>").text("Restaurant alias: " + name_biz).appendTo(restDiv)
            likeBtn.appendTo(restDiv)
            dislikeBtn.appendTo(restDiv)
    
            restaurantPhotos();
            getReviews();
            
        })    
    });
} 

// Returns a city by using the id stored in mysql
// Will want to pull the id from within this function likely
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

// Gets photos of the restaurant
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

// Gets reviews for the restaurant
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

// Gets the users current location for use to display nearby options
function getCoordinates() {
    navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    lat = pos.lat;
    long = pos.lng;
    })
}

// Sets up the ability to use geolocation from google maps
function geolocation() {

    var googleMapsURL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=${maps}`;
    
    $.ajax({
        url: googleMapsURL,
        method: "GET",
    })
    .then(function(res){
        getCoordinates();
    })    
} 

// Sends the info to be saved to the database for future searches
function sendInfo() {
    var info = [];
    info.push(id);
    info.push(name_biz);
    info.push(picURL);
    console.log(info);
    $.ajax("/api/restaurants", {
        type: "POST",
        body: info
    }).then(function(res) {
        console.log(res);
    });
}

// Gets the keys from server side, and then user location
function getKeysAndLocation() {
    $.ajax("/api/keys", {
    type: "GET",
    }).then(
    function(res) {
        yelp = res[0];
        maps = res[1];
        geolocation();
    });
}

$( document ).ready(function() {
    // Runs immediately to have info available before they start searching, prevents sync timing errors
    getKeysAndLocation();
    
    $("#proximity").on("click", function(event) {
        nearbyRestaurants();
    } )

    $("#search").on("click", function(event) {
        event.preventDefault();
        searchRestaurants();
        $("#city").val("");
    })

});