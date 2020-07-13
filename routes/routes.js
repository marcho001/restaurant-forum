const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/ ' })


  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error_msg', '請先登入才能使用')
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) return next()
      return res.redirect('/')
    }
    req.flash('error_msg', '請先登入才能使用')
    res.redirect('/signin')
  }
  const authenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
      const id = Number(req.params.id)
      if (req.user.id === id) return next()
      req.flash('error_msg', '請不要進入別人的頁面')
      return res.redirect(`/users/${id}`)
    }
    req.flash('error_msg', '請先登入才能使用')
    return res.redirect('/signin')
  }

  router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  router.get('/restaurants', authenticated, restController.getRestaurants)
  router.get('/restaurants/feeds', authenticated, restController.getFeeds)
  router.get('/restaurants/top', authenticated, restController.getTop10)
  router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
  router.get('/restaurants/:id', authenticated, restController.getRestaurant)


  router.get('/signup', userController.signUpPage)
  router.post('/signup', userController.signUp)

  router.get('/signin', userController.signInPage)
  router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  router.get('/logout', userController.logout)

  router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  router.get('/admin/users', authenticatedAdmin, adminController.getUser)
  router.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)

  router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  router.post('/comments', authenticated, commentController.postComment)
  router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  router.get('/users/top', authenticated, userController.getTopUser)
  router.get('/users/:id', authenticated, userController.getUser)
  router.get('/users/:id/edit', authenticatedUser, userController.editUser)
  router.put('/users/:id', authenticatedUser, upload.single('image'), userController.putUser)

  router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

  router.post('/following/:userId', authenticated, userController.addFollowing)
  router.delete('/following/:userId', authenticated, userController.removeFollowing)

  router.post('/like/:restaurantId', authenticated, userController.addLike)
  router.delete('/like/:restaurantId', authenticated, userController.removeLike)

  router.get('/more', authenticated, (req, res) => {
    res.send('此功能還沒做好> <')
  })

module.exports = router