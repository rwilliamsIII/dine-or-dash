// /autocomplete --- to offer suggested restaurants

var alias = "";
var id = "";
var restDiv = $(".restaurants")

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
            "Authorization": "Bearer FX7G_LW66z7oBdEKO1pNijgUXQbOknj073l6OGxkmIZ1XWT7J2isalDcZmqv0UC0CM0yj3Mgqkqs-STQDSeOtL-C_RWLhzMbFdV1xdFV5RCmWXPWZz81cMkThT1tXnYx",
        }
    })
    .then(function(res){
        console.log(res);

        var restName = res.businesses[0].name;
        var restId = res.businesses[0].id;
        var likeBtn = $("<button>").text("Dine!");
        var dislikeBtn = $("<button>").text("Dash!");

        var newLikedRest = {
            id: restId,
            rest_name: restName
        };

        likeBtn.on("click", function(){
            sendRest(newLikedRest);
            console.log(newLikedRest);
        });

        $("<p class='restId'>").text("Restaurant ID: " + restId).appendTo(restDiv)
        $("<p class='restName'>").text("Restaurant name: " + restName).appendTo(restDiv)
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
            "Authorization": "Bearer FX7G_LW66z7oBdEKO1pNijgUXQbOknj073l6OGxkmIZ1XWT7J2isalDcZmqv0UC0CM0yj3Mgqkqs-STQDSeOtL-C_RWLhzMbFdV1xdFV5RCmWXPWZz81cMkThT1tXnYx",
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
            "Authorization": "Bearer FX7G_LW66z7oBdEKO1pNijgUXQbOknj073l6OGxkmIZ1XWT7J2isalDcZmqv0UC0CM0yj3Mgqkqs-STQDSeOtL-C_RWLhzMbFdV1xdFV5RCmWXPWZz81cMkThT1tXnYx",
        }
    })
        .then(function(res){
            // photoArray = [];
            // for (vari=0;i<res.)
            console.log(res);
        })
} 

function getReviews() {
    // Replace everything after 'businesses/' with the alias variable from searchRestaurants call
    var reviewsURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${alias}/reviews`;
    $.ajax({
        url: reviewsURL,
        method: "GET",
        headers: {
            "Authorization": "Bearer FX7G_LW66z7oBdEKO1pNijgUXQbOknj073l6OGxkmIZ1XWT7J2isalDcZmqv0UC0CM0yj3Mgqkqs-STQDSeOtL-C_RWLhzMbFdV1xdFV5RCmWXPWZz81cMkThT1tXnYx",
        }
    })
        .then(function(res){
            console.log(res);
        })
} 


// Sends the id from one of the previous yelp calls to the database, so it can be sent back to display the favorites page
function sendRest(Restaurant) {
        $.post("/api/posts/", Restaurant, function() {
          console.log("Restaurant added!");
        });
      }

$( document ).ready(function() {
    $("#search").on("click", function(event) {
        event.preventDefault();
        searchRestaurants();
        $("#city").val("");
    })
});