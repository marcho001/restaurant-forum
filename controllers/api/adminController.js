const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminServices = require('../../services/adminService')
const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res,(data) => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    adminServices.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  getCategories: (req, res) => {
    adminServices.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteRestaurant: (req, res) => {
    adminServices.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  postRestaurant: (req, res) => {
    adminServices.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  putRestaurant: (req, res) => {
    adminServices.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  postCategory: (req, res) => {
    adminServices.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  putCategory: (req, res) => {
    adminServices.putCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  // deleteCategory: (req, res) => {
  //   adminServices.deleteCategory(req, res, (data) => {
  //     return res.json(data)   
  //   })
  // }
}
module.exports = adminController