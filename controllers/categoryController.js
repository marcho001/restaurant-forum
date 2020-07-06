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
    const { name } = req.body
    if (!name) {
      req.flash('error_msg', '此分類不存在')
    } else {
      return Category.create({ name })
        .then(category => {
          res.redirect('/admin/categories')
        })
    }
  },
  putCategory: (req, res) => {

  },
  deleteCategory: (req, res) => {

  }
}

module.exports = categoryController