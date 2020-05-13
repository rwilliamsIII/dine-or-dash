# Initializing global variables
alias = this
id = this
name_biz = this
picURL = this
restDiv = $(".restaurants")
pos = this
yelp = this
maps = this
lat = this
long = this
businessArray = []
offset = this
city = this
cityCount = this

# Searches restaurants based on the users entry
searchRestaurants = ->
    
    offset = Math.floor(Math.random() * 500)
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=#{city}&categories=restaurants&limit=1&offset=#{offset}"
        method: "GET"
        cache: true
        headers: "Authorization": yelp
    }).then((res) ->
        console.log(res)
        name_biz = res.businesses[0].name
        alias = res.businesses[0].alias
        id = res.businesses[0].id
        picURL = res.businesses[0].image_url
        likeBtn = $("<button>").text("Dine!")
        dislikeBtn = $("<button>").text("Dash!")
        likeBtn.on "click", ->
            city = JSON.parse(window.localStorage.getItem("City"))
            searchRestaurants()
        dislikeBtn.on "click", ->
            searchRestaurants()
        $("<h3>").text("Restaurant ID: " + id).appendTo(restDiv)
        $("<h3>").text("Restaurant alias: " + name_biz).appendTo(restDiv)
        likeBtn.appendTo(restDiv)
        dislikeBtn.appendTo(restDiv)
        restaurantPhotos()
        getReviews()
    )            

# Nearby restaurants search function
nearbyRestaurants = ->
    offset = Math.floor(Math.random() * 500);
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=#{lat}&longitude=#{long}&categories=restaurants&limit=1&offset=#{offset}"
        method: "GET"
        cache: true
        headers: "Authorization": yelp
    }).then((res) ->
        console.log(res)
        name_biz = res.businesses[0].name
        alias = res.businesses[0].alias
        id = res.businesses[0].id
        picURL = res.businesses[0].image_url
        likeBtn = $("<button>").text("Dine!")
        dislikeBtn = $("<button>").text("Dash!")
        likeBtn.on "click",  ->
            sendInfo()
        dislikeBtn.on "click", ->
            nearbyRestaurants()
        $("<h3>").text("Restaurant ID: " + id).appendTo(restDiv)
        $("<h3>").text("Restaurant alias: " + name_biz).appendTo(restDiv)
        likeBtn.appendTo(restDiv)
        dislikeBtn.appendTo(restDiv)
        restaurantPhotos()
        getReviews()
    )       

# Returns a city by using the id stored in mysql. Will want to pull the id from within this function likely
searchRestaurantsByID = -> 
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/#{id}"
        method: "GET"
        cache: true
        headers: {"Authorization": yelp}
    })
    .then((res) ->
        console.log(res)
    )    

# Gets photos of the restaurant
restaurantPhotos = ->
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/#{alias}"
        method: "GET"
        cache: true
        headers: {"Authorization": yelp}
    })
    .then((res) ->
        console.log(res)
    )

# Gets reviews for the restaurant
getReviews = ->
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/#{alias}/reviews"
        method: "GET"
        cache: true
        headers: {"Authorization": yelp}
    })
    .then((res) ->
        console.log(res)
    )

# Gets the users current location for use to display nearby options
getCoordinates = ->
    navigator.geolocation.getCurrentPosition((position) ->
        pos = {
            lat: position.coords.latitude
            lng: position.coords.longitude
        }
        lat = pos.lat
        long = pos.lng
        $("#proximity").attr("disabled", false)
    )

# Sets up the ability to use geolocation from google maps
geolocation = ->
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=#{maps}"
        cache: true
        method: "GET"
    })
    .then((res) ->
        getCoordinates()
    )

# Sends the info to be saved to the database for future searches
sendInfo = ->
    info = []
    info.push(id)
    info.push(name_biz)
    info.push(picURL)
    $.post "/api/restaurants",
        id: "#{id}"
        name_biz: "#{name_biz}"
        picURL: "#{picURL}"
    .then((res) ->
        console.log(res)
    )

# Gets the keys from server side, and then user location
getKeysAndLocation = ->
    $.get "/api/keys", (res) ->
        yelp = "#{res[0]}"
        maps = "#{res[1]}"
        geolocation()

setCity = ->
    if $("#city").val().trim() != ""
        window.localStorage.clear()
        cities = []
        cities.push($("#city").val().trim())
        localStorage.setItem("City", JSON.stringify(cities))
    else 
        alert("You must enter a city! Or select nearby restaurants.")

$( document ).ready ->
    # Runs immediately to have info available before they start searching, prevents sync timing errors
    getKeysAndLocation()
    $("#proximity").click (event) ->
        nearbyRestaurants()
    $("#search").click (event) ->
        event.preventDefault()
        city = $("#city").val().trim()
        setCity()
        searchRestaurants()
        $("#city").val("")