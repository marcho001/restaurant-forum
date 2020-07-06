const db = require('../models')
const Category = db.Category


let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', { categories })
    })
  },
  postCategory: (req, res) => {
    
  },
  putCategory: (req, res) => {

  },
  deleteCategory: (req, res) => {

  }
}

module.exports = categoryController