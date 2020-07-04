let db = require('../models')
const Restaurant = db.Restaurant
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image:`/upload/${file.originalname}`
          })
          .then(restaurant => {
            req.flash('success_msg', '成功新增餐廳資訊')
            return res.redirect('/admin/restaurants')
          })
          .catch(err => console.log(err))
        })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
      })
        .then(restaurant => {
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
      try {
        const data = fs.readFileSync(file.path)
        fs.writeFileSync(`upload/${file.originalname}`, data)
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: `/upload/${file.originalname}`
            })
            .then(() => {
              req.flash('success_messages', '成功更新餐廳資訊！')
              return res.redirect('/admin/restaurants')
            })
          })  
      } catch(err) {
        console.log(err)
      }
    } else {
      try {
        const restaurant = Promise.resolve(Restaurant.findByPk(req.params.id))
        restaurant.then(restaurant => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image
          })
          .then(() => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
      } catch(err) {
        console.log(err)
      }
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