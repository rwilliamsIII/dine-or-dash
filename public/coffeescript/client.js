// Generated by CoffeeScript 2.5.1
(function() {
  // Initializing global variables
  var alias, city, cityCount, counter, delay, geoConfirm, geoID, geolocate, getCoordinates, getKeys, getReviews, id, lat, long, maps, name_biz, nearbyRestaurants, offset, picURL, pos, randomSelection, restDiv, restaurantArray, restaurantPhotos, searchRestaurants, searchRestaurantsByID, selection, sendInfo, setCity, yelp;

  alias = this;

  id = this;

  name_biz = this;

  picURL = this;

  restDiv = $(".restaurants");

  pos = this;

  yelp = this;

  maps = this;

  lat = this;

  long = this;

  city = this;

  cityCount = this;

  offset = 0;

  counter = 0;

  restaurantArray = [];

  geoConfirm = this;

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  geoID = this;

  selection = this;

  // Searches restaurants based on the users entry
  searchRestaurants = function() {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${city}&categories=restaurants&limit=50&offset=${offset}`,
      method: "GET",
      cache: true,
      headers: {
        "Authorization": yelp
      }
    }).then(function(res) {
      var count, dislikeBtn, likeBtn;
      console.log(restaurantArray);
      count = 0;
      while (count <= 50) {
        if (count === 50) {
          offset = offset + 50;
          return delay(100, function() {
            return searchRestaurants();
          });
        } else {
          if (res.businesses[count] !== void 0) {
            restaurantArray.push(res.businesses[count]);
            count++;
          } else if (res.businesses[count] === void 0) {
            return;
          }
        }
        if (offset >= 100) {
          break;
        }
      }
      cardDiv = $("<div class='ui card'>");
      restImg = $("<img>");
      restImg.attr("class", "image");
      restImg.attr("src", res.Array[0].image_url);
      cardContent = $("<div class='content'>");
      restHeader = $("<p class='header'>").text(res.Array[0].name);
      likeBtn = $("<button>").text("Dine!");
      dislikeBtn = $("<button>").text("Dash!");
      restHeader.appendTo(cardContent);
      cardDiv.append(restImg, cardContent);
      cardDiv.appendTo(restDiv);
      likeBtn.off('click').click(function(event) {
        randomSelection();
        return sendInfo();
      });
      dislikeBtn.off('click').click(function(event) {
        return randomSelection();
      });
      likeBtn.appendTo(cardDiv);
      return dislikeBtn.appendTo(cardDiv);
    });
  };

  
  // Nearby restaurants search function
  nearbyRestaurants = function() {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&categories=restaurants&limit=50&offset=${offset}`,
      method: "GET",
      cache: true,
      headers: {
        "Authorization": yelp
      }
    }).then(function(res) {
      var count, dislikeBtn, likeBtn;
      $("#proximity").remove();
      console.log(restaurantArray);
      count = 0;
      while (count <= 50) {
        if (count === 50) {
          offset = offset + 50;
          return delay(100, function() {
            return nearbyRestaurants();
          });
        } else {
          if (res.businesses[count] !== void 0) {
            restaurantArray.push(res.businesses[count]);
            count++;
          } else if (res.businesses[count] === void 0) {
            return;
          }
        }
        if (offset >= 100) {
          break;
        }
      }
      cardDiv = $("<div class='ui card'>");
      restImg = $("<img>");
      restImg.attr("class", "image");
      restImg.attr("src", res.Array[0].image_url);
      cardContent = $("<div class='content'>");
      restHeader = $("<p class='header'>").text(res.Array[0].name);
      likeBtn = $("<button>").text("Dine!");
      dislikeBtn = $("<button>").text("Dash!");
      restHeader.appendTo(cardContent);
      cardDiv.append(restImg, cardContent);
      cardDiv.appendTo(restDiv);
      likeBtn.off('click').click(function(event) {
        randomSelection();
        return sendInfo();
      });
      dislikeBtn.off('click').click(function(event) {
        return randomSelection();
      });
      likeBtn.appendTo(cardDiv);
      return dislikeBtn.appendTo(cardDiv);
    });
  };

  
  // Returns a city by using the id stored in mysql. Will want to pull the id from within this function likely
  searchRestaurantsByID = function() {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}`,
      method: "GET",
      cache: true,
      headers: {
        "Authorization": yelp
      }
    }).then(function(res) {
      return console.log(res);
    });
  };

  
  // Gets photos of the restaurant
  restaurantPhotos = function() {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${alias}`,
      method: "GET",
      cache: true,
      headers: {
        "Authorization": yelp
      }
    }).then(function(res) {
      return console.log(res);
    });
  };

  // Gets reviews for the restaurant
  getReviews = function() {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${alias}/reviews`,
      method: "GET",
      cache: true,
      headers: {
        "Authorization": yelp
      }
    }).then(function(res) {
      return console.log(res);
    });
  };

  // Gets the users current location for use to display nearby options
  getCoordinates = function() {
    var error, options, success;
    options = {
      enableHighAccuracy: false,
      timeout: 5000
    };
    error = function(err) {
      return console.log('ERROR(' + err.code + '): ' + err.message);
    };
    success = function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(position);
      lat = pos.lat;
      long = pos.lng;
      return navigator.geolocation.clearWatch(id);
    };
    return id = navigator.geolocation.watchPosition(success, error, options);
  };

  // Sets up the ability to use geolocation from google maps
  geolocate = function() {
    return $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=${maps}`,
      cache: true,
      method: "GET"
    }).then(function(res) {
      return getCoordinates();
    });
  };

  // Sends the info to be saved to the database for future searches
  sendInfo = function() {
    var info;
    info = [];
    info.push(selection[0].id);
    info.push(selection[0].name);
    info.push(selection[0].image_url);
    return $.post("/api/restaurants", {
      id: `${id}`,
      name_biz: `${name_biz}`,
      picURL: `${picURL}`
    }).then(function(res) {
      return console.log(res);
    });
  };

  // Gets the keys from server side
  getKeys = function() {
    return $.get("/api/keys", function(res) {
      yelp = `${res[0]}`;
      return maps = `${res[1]}`;
    });
  };

  // Sets the user's input to local storage in order to repeat search the same city
  // Might be redundant now with the new array method, in this case just move searchRestaurants() directly to the click event
  setCity = function() {
    var cities;
    if ($("#city").val().trim() !== "") {
      window.localStorage.clear();
      city = $("#city").val().trim();
      cities = [];
      cities.push($("#city").val().trim());
      localStorage.setItem("City", JSON.stringify(cities));
      return searchRestaurants();
    } else {
      return alert("You must enter a city! Or select nearby restaurants.");
    }
  };

  // Randomly selects a restaurant from the generated array of restaurants
  randomSelection = function() {
    var random;
    random = Math.floor(Math.random() * restaurantArray.length);
    console.log(random);
    console.log(restaurantArray);
    console.log(restaurantArray[random]);
    return selection = restaurantArray.splice(random, 1);
  };

  $(document).ready(function() {
    // Runs immediately to have info available before they start searching, prevents sync timing errors
    getKeys();
    $("#proximity").click(function(event) {
      if (JSON.parse(window.localStorage.getItem("Location Services")) !== true) {
        geoConfirm = confirm("This website is requesting your location to provide you with location based services.");
        console.log(geoConfirm);
        if (geoConfirm === true) {
          localStorage.setItem("Location Services", JSON.stringify(geoConfirm));
          geolocate();
          restaurantArray = [];
          return delay(4000, function() {
            return nearbyRestaurants();
          });
        } else if (geoConfirm === false) {
          return alert("Location services were denied, please enter a city.");
        }
      } else if (JSON.parse(window.localStorage.getItem("Location Services")) === true) {
        geolocate();
        restaurantArray = [];
        return delay(4000, function() {
          return nearbyRestaurants();
        });
      }
    });
    return $("#search").click(function(event) {
      restaurantArray = [];
      event.preventDefault();
      setCity();
      return $("#city").val("");
    });
  });

}).call(this);
