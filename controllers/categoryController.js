const db = require('../models')
const Category = db.Category


let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id, {
          raw: true,
          nest: true
        })
          .then(category => {
            return res.render('admin/categories', {
              categories,
              category
            })
          })
      } else {
        return res.render('admin/categories', { categories })
      }

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
    const { name } = req.body
    if (!name) {
      req.flash('error_msg', '此分類不存在')
      return res.redirect('back')
    } else {
      console.log(req.params.id)
      return Category.findByPk(req.params.id)
      .then(category => {
        category.update(req.body)
          .then(category => res.redirect('/admin/categories'))
      })
    }
  },
  deleteCategory: (req, res) => {

  }
}

module.exports = categoryController