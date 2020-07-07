const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    Restaurant.findAll({ include: Category, where: whereQuery })
      .then(restaurant => {
        const data = restaurant.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0,50),
          categoryName: r.Category.name
        }))
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => {
          return res.render('restaurants', {
            categories,
            categoryId,
            restaurants: data
        })
        })
      })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        return res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
  }
}

module.exports = restController