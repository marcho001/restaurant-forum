let db = require('../models')
const Restaurant = db.Restaurant

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
    if (!name) {
      req.flash('error_msg', '請輸入名稱')
      return res.redirect('back')
    }
    return Restaurant.create({
      name,
      tel,
      address,
      opening_hours,
      description
    })
    .then((restaurant) => {
      req.flash('success_msg', '新增成功！')
      res.redirect('/admin/restaurants')
    })
    .catch(err => console.log('create restaurant', err))
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
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_msg', '請輸入名稱')
      return res.redirect('back')
    }
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description
        })
        .then(restaurant => {
          req.flash('success_msg', '成功修改餐廳資訊！')
          res.redirect('/admin/restaurants')
        })
      })
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