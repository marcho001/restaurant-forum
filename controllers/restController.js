const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite
const User = db.User

const pageLimit = 10

let restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ 
      include: Category, where: whereQuery, offset, limit: pageLimit 
    })
      .then(result => {
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(result.count / pageLimit)
        let totalPage = Array.from({ length: pages 
        }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page + 1 > pages ? pages : page + 1
        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0,50),
          categoryName: r.Category.name,
          isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLike: req.user.LikeRestaurants.map(d => d.id).includes(r.id)
        }))
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => {
          return res.render('restaurants', {
            categories,
            categoryId,
            restaurants: data,
            page, totalPage, prev, next
        })
        })
      })
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] },
        { model: User, as: 'LikeUsers'}
      ]
    })
    await restaurant.update({
      totalViews: ++restaurant.totalViews
    })
    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
    const isLike = restaurant.LikeUsers.map(d => d.id).includes(req.user.id)
    return res.render('restaurant', {
      restaurant: restaurant.toJSON(),
      isFavorited,
      isLike
    })
 
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants,
          comments
        })
      })
    })
  },
  getDashboard: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
    const countComment = await Comment.count({ 
      where: { RestaurantId: restaurant.id}
    })
    res.render('restDashboard', { restaurant, countComment })
  },
  getTop10: async (req, res) => {
    //找出收藏數
    //找出所有餐廳
    let restaurants = await Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
    restaurants = restaurants.map(rest => ({
      ...rest.dataValues,
      description: rest.description.substring(0, 150),
      countFavor: rest.FavoritedUsers.length,
      isFavorited: rest.FavoritedUsers.map(d => d.id).includes(req.user.id)

    }))
    restaurants = restaurants.sort((a, b) => 
    b.countFavor - a.countFavor)
    restaurants = restaurants.slice(0, 10)

    
    console.log(restaurants)
    console.log('=======')
    console.log(restaurants.FavoritedUsers)
    return res.render('top10', { restaurants })
  }
}

module.exports = restController