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
  putRestaurant: async (req, res, cb) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      return cb({ status: 'error', message: '請輸入名稱'})
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: img.data.link,
              CategoryId: categoryId
            })
              .then(() => {
                return cb({ status: 'success', message: '成功更新餐廳資訊！' })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image,
            CategoryId: categoryId
          })
            .then(() => {
              return cb({ status: 'success', message: '成功更新餐廳資訊！' })
            })
        })
    }
  },
  postCategory: (req, res, cb) => {
    const { name } = req.body
    if (!name) {
      return cb({ status: 'error', message: '請輸入類別名稱'})
    } else {
      Category.create({ name })
      return cb({ status: 'success', message: '成功新增類別'})
    }
  },
  putCategory: async (req, res, cb) => {
    const { name } = req.body
    if (!name) {
      return cb({ status: 'error', message: '請輸入類別名稱' })
    } else {
      const category = await Category.findByPk(req.params.id)
      category.update({ name })
      return cb({ status: 'success', message: '類別更新成功' })
    }
  },
  // deleteCategory: async (req, res, cb) => {
  //   const category = await Category.findByPk(req.params.id)
  //   category.destroy()
  //   return cb({ status: 'success', message: ''})
  // }
}

module.exports = adminService