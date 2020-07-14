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
  },
  deleteRestaurant: async (req, res, cb) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    restaurant.destroy()
    cb({ status: 'success', message: '' })
  },
  postRestaurant: (req, res, cb) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    if (!name) {
      return cb({ status: 'error', message: '請輸入名稱'})
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: img.data.link,
          CategoryId: categoryId
        })
          .then(restaurant => {
            cb({ status: 'success', message: '成功新增餐廳資訊' })
          })
          .catch(err => console.log(err))
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null,
        CategoryId: categoryId
      }).then((restaurant) => {
        cb({ status: 'success', message: '成功新增餐廳資訊' })
      })
        .catch(err => console.log(err))
    }
  },
}

module.exports = adminService