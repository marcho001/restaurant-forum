let db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let adminService = {
  getRestaurants: async (req, res, callback) => {
    const restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }) 
    return callback({ restaurants })
  },
  getRestaurant: async (req, res, cb) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category],
      raw: true,
      nest: true
    })
    return cb({ restaurant })
  },
  getCategories: async (req, res, cb) => {
    const categories = await Category.findAll({
      raw: true,
      nest: true
    })
    if(req.params.id) {
      const category = await Category.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      return cb({ categories, category })
    } else {
      return cb({ categories })
    }
    // .then(categories => {
    //   if (req.params.id) {
    //     Category.findByPk(req.params.id, {
    //       raw: true,
    //       nest: true
    //     })
    //       .then(category => {
    //         return res.render('admin/categories', {
    //           categories,
    //           category
    //         })
    //       })
    //   } else {
    //     return res.render('admin/categories', { categories })
    //   }

    // })
  },
}

module.exports = adminService