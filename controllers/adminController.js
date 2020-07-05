let db = require('../models')
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const fs = require('fs')

let adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true
    })
    .then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
    .catch(err => console.log(err))
    

  },
  createRestaurant: (req, res) => res.render('admin/create'),
  postRestaurant: (req,res) => {
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req
    if (!name) {
      req.flash('error_msg', '請輸入名稱')
      return res.redirect('back')
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
          image: img.data.link
        })
          .then(restaurant => {
            req.flash('success_msg', '成功新增餐廳資訊')
            return res.redirect('/admin/restaurants')
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
        image: null
      }).then((restaurant) => {
        req.flash('success_msg', '成功新增餐廳資訊')
        return res.redirect('/admin/restaurants')
      })
        .catch(err => console.log(err))
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw: true})
    .then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, 
      {raw:true})
      .then(restaurant => {
        return res.render('admin/create', 
        { restaurant })
      })
  },
  putRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_msg', '請輸入名稱')
      return res.redirect('back')
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
              image: img.data.link
            })
            .then(() => {
              req.flash('success_messages', '成功更新餐廳資訊！')
              return res.redirect('/admin/restaurants')
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
            image: restaurant.image
          })
            .then(() => {
              req.flash('success_messages', '成功更新餐廳資訊')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
        res.redirect('/admin/restaurants')
          // .then(restaurant => res.redirect('/admin/restaurants'))
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController