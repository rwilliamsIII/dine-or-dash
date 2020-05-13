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
city = this
cityCount = this
offset = 0
counter = 0
restaurantArray = []

# Searches restaurants based on the users entry
searchRestaurants = ->
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=#{city}&categories=restaurants&limit=50&offset=#{offset}"
        method: "GET"
        cache: true
        headers: "Authorization": yelp
    }).then((res) ->
        console.log(restaurantArray)
        count = 0
        while count <= 50
            if count == 50
                offset = offset + 50
                delay = (ms, func) -> setTimeout func, ms
                return delay 100, -> searchRestaurants()
            else
                if res.businesses[count] != undefined
                    restaurantArray.push(res.businesses[count])
                    count++
                else if res.businesses[count] == undefined
                    return
            if offset == 250
                break
        likeBtn = $("<button>").text("Dine!");
        dislikeBtn = $("<button>").text("Dash!");
        likeBtn.off('click').click (event) ->
            randomSelection()
        dislikeBtn.off('click').click (event) ->
            randomSelection()
        likeBtn.appendTo(restDiv)
        dislikeBtn.appendTo(restDiv)
    )            

# Nearby restaurants search function
nearbyRestaurants = ->
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=#{lat}&longitude=#{long}&categories=restaurants&limit=50&offset=#{offset}"
        method: "GET"
        cache: true
        headers: "Authorization": yelp
    }).then((res) ->
        console.log(restaurantArray)
        count = 0
        while count <= 50
            if count == 50
                offset = offset + 50
                delay = (ms, func) -> setTimeout func, ms
                return delay 100, -> nearbyRestaurants()
            else
                if res.businesses[count] != undefined
                    restaurantArray.push(res.businesses[count])
                    count++
                else if res.businesses[count] == undefined
                    return
            if offset == 250
                break
        likeBtn = $("<button>").text("Dine!");
        dislikeBtn = $("<button>").text("Dash!");
        likeBtn.off('click').click (event) ->
            randomSelection()
        dislikeBtn.off('click').click (event) ->
            randomSelection()
        likeBtn.appendTo(restDiv)
        dislikeBtn.appendTo(restDiv)
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

# Sets the user's input to local storage in order to repeat search the same city
# Might be redundant now with the new array method, in this case just move searchRestaurants() directly to the click event
setCity = ->
    if $("#city").val().trim() != ""
        window.localStorage.clear()
        city = $("#city").val().trim()
        cities = []
        cities.push($("#city").val().trim())
        localStorage.setItem("City", JSON.stringify(cities))
        searchRestaurants()
    else 
        alert("You must enter a city! Or select nearby restaurants.")

randomSelection = ->
    selection = Math.floor(Math.random() * restaurantArray.length)
    console.log(selection)
    console.log(restaurantArray)
    console.log(restaurantArray[selection])
    restaurantArray.splice(selection, 1)

$( document ).ready ->
    # Runs immediately to have info available before they start searching, prevents sync timing errors
    getKeysAndLocation()
    $("#proximity").click (event) ->
        restaurantArray = []
        nearbyRestaurants()
    $("#search").click (event) ->
        restaurantArray = []
        event.preventDefault()
        setCity()
        $("#city").val("")