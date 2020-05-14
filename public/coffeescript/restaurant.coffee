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
geoConfirm = this
delay = (ms, func) -> setTimeout func, ms
geoID = this

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
                return delay 100, -> searchRestaurants()
            else
                if res.businesses[count] != undefined
                    restaurantArray.push(res.businesses[count])
                    count++
                else if res.businesses[count] == undefined
                    return
            if offset >= 100
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
        $("#proximity").remove()
        console.log(restaurantArray)
        count = 0
        while count <= 50
            if count == 50
                offset = offset + 50
                return delay 100, -> nearbyRestaurants()
            else
                if res.businesses[count] != undefined
                    restaurantArray.push(res.businesses[count])
                    count++
                else if res.businesses[count] == undefined
                    return
            if offset >= 100
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
    options = {
        enableHighAccuracy: false,
        timeout: 5000,
    }
    error = (err) ->
        console.log('ERROR(' + err.code + '): ' + err.message)
    success = (position) ->
        pos = {
            lat: position.coords.latitude
            lng: position.coords.longitude
        }
        console.log(position)
        lat = pos.lat
        long = pos.lng
        navigator.geolocation.clearWatch(id)
    id = navigator.geolocation.watchPosition(success, error, options)

# Sets up the ability to use geolocation from google maps
geolocate = ->
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

# Gets the keys from server side
getKeys = ->
    $.get "/api/keys", (res) ->
        yelp = "#{res[0]}"
        maps = "#{res[1]}"

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

# Randomly selects a restaurant from the generated array of restaurants
randomSelection = ->
    selection = Math.floor(Math.random() * restaurantArray.length)
    console.log(selection)
    console.log(restaurantArray)
    console.log(restaurantArray[selection])
    restaurantArray.splice(selection, 1)

$( document ).ready ->
    # Runs immediately to have info available before they start searching, prevents sync timing errors
    getKeys()
    $("#proximity").click (event) ->
        if JSON.parse(window.localStorage.getItem("Location Services")) != true
            geoConfirm = confirm("This website is requesting your location to provide you with location based services.")
            console.log(geoConfirm)
            if geoConfirm == true
                localStorage.setItem("Location Services", JSON.stringify(geoConfirm))
                geolocate()
                restaurantArray = []
                return delay 4000, -> nearbyRestaurants()
            else if geoConfirm == false
                alert("Location services were denied, please enter a city.")
        else if JSON.parse(window.localStorage.getItem("Location Services")) == true
            geolocate()
            restaurantArray = []
            return delay 4000, -> nearbyRestaurants()
    $("#search").click (event) ->
        restaurantArray = []
        event.preventDefault()
        setCity()
        $("#city").val("")