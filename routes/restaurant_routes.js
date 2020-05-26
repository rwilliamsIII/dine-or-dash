const db = require('../models')
require('dotenv').config()
const passport = require('../config/passport')
const Handlebars = require('handlebars')
Handlebars.registerPartial('card', '{{card}}')
var isAuthenticated = require('../config/authenticated')

module.exports = function (app) {
  // Route to check the login credentials
  app.post('/api/login', passport.authenticate('local'), function (req, res) {
    res.json(req.user)
  })

  // Logs the user out to the login page
  app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/login')
  })

  // Route to create a user from the sign-up page
  app.post('/api/signup', function (req, res) {
    db.User.create({
      username: req.body.username,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, '/api/login')
      })
      .catch(function (err) {
        res.status(401).json(err)
      })
  })

  // Route to create a comment on a restaurant
  app.post('/api/comments', function (req, res) {
    db.Comments.create({
      resID: req.body.resID.attr,
      user: req.user.username,
      comment: req.body.comment
    })
      .then(function (comment) {
        console.log(comment)
        res.json(comment)
      })
  })

  // Sending protected api keys to client side
  app.get('/api/keys', function (req, res) {
    var keys = []
    keys.push(process.env.YELP_KEY)
    keys.push(process.env.MAPS_KEY)
    res.json(keys)
  })

  // Creates a new restaurant
  app.post('/api/restaurants', function (req, res) {
    db.Restaurant.create({
      resID: req.body.id,
      name: req.body.name,
      user: req.user.username,
      pic_url: req.body.picURL,
      yelp_url: req.body.yelp,
      rating: req.body.rating,
      liked: true,
      favorited: false
    }).then(function (newRestaurant) {
      res.json(newRestaurant)
    })
  })

  // Creates a new user in the Users table
  app.post('/api/users', function (req, res) {
    db.User.create({
      username: req.body.username,
      password: req.body.password
    }).then(function (newUser) {
      res.json(newUser)
    })
  })

  // Deletes a restaurant
  app.delete('/api/restaurants', function (req, res) {
    db.Restaurant.destroy({ where: { resID: req.body.id.attr } }).then(function (deletedRestaurant) {
      res.json(deletedRestaurant)
    })
  })

  // Favorites a restaurant
  app.put('/api/restaurants', function (req, res) {
    db.Restaurant.findOne({
      where: { resID: req.body.id.attr }
    }).then(function (alteredRestaurant) {
      alteredRestaurant.update({
        liked: false,
        favorited: true
      }).then(function (response) {
        res.json(response)
      })
    })
  })

  // Renders the liked page restaurants
  app.get('/liked/restaurants', isAuthenticated, function (req, res) {
    db.Restaurant.findAll({ where: { liked: true } }).then(function (likedRestaurants) {
      res.send(likedRestaurants)
    })
  })

  // Renders the favorites page restaurants
  app.get('/favorites/restaurants', isAuthenticated, function (req, res) {
    db.Restaurant.findAll({ where: { favorited: true } }).then(function (favoriteRestaurants) {
      res.send(favoriteRestaurants)
    })
  })

  // Renders the liked page restaurants
  app.get('/comments/restaurants:id', isAuthenticated, function (req, res) {
    db.Comments.findAll({ where: { resID: req.params.id } }).then(function (comments) {
      res.send(comments)
    })
  })

  // Displays the card template handlebar
  app.get('/api/card/:id', function (req, res) {
    var id = req.params.id
    db.Restaurant.findOne({ where: { resID: id } }).then(function (restaurants) {
      var restaurant = restaurants
      var id = restaurant.id
      var name = restaurant.name
      var yelp = restaurant.yelp_url
      var imageURL = restaurant.pic_url
      var rating = restaurant.rating
      var info = { restaurant: { id, name, yelp, imageURL, rating } }
      res.send(info)
    })
  })
}
