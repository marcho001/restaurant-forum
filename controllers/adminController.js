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
  }
}

module.exports = adminController