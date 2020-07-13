let db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService.js')

let adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('/admin/restaurants', data)
    })
    // return Restaurant.findAll({
    //   raw: true,
    //   nest: true,
    //   include: [Category]
    // })
    // .then(restaurants => {
    //   return res.render('admin/restaurants', { restaurants })
    // })
    // .catch(err => console.log(err))
    

  },
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true,
    }).then(categories => {
      return res.render('admin/create', { categories })
    })
    
  },
  postRestaurant: (req,res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
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
          image: img.data.link,
          CategoryId : categoryId
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
        image: null,
        CategoryId: categoryId
      }).then((restaurant) => {
        req.flash('success_msg', '成功新增餐廳資訊')
        return res.redirect('/admin/restaurants')
      })
        .catch(err => console.log(err))
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { 
      include: [Category],
      raw: true,
      nest: true
     })
    .then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id, 
        {
          raw: true,
          nest: true
        })
        .then(restaurant => {
          return res.render('admin/create', 
          { restaurant, categories })
      })
    })
  },
  putRestaurant: async (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
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
              image: img.data.link,
              CategoryId: categoryId
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
            image: restaurant.image,
            CategoryId: categoryId
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
  },
  getUser: (req, res) => {
    return User.findAll({
      raw: true,
      order: [
        ['id','ASC']
      ]
    })
      .then(users => {
        res.render('admin/users', { users })
      })
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id)
    .then(user => {
      if (req.user.id === user.id) {
        req.flash('error_msg', '傻了嗎想把自己刪除？')
        return res.redirect('/admin/users')
      }
      let isAdmin = user.isAdmin
      isAdmin ? isAdmin = 0 : isAdmin = 1
      user.update({ isAdmin })
      req.flash('success_msg', '成功更新使用者！')
      return res.redirect('/admin/users')
      })
  }
}

module.exports = adminController