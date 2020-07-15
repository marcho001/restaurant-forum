const db = require('../models')
const Category = db.Category
const adminServices = require('../services/adminService')


let categoryController = {
  getCategories: (req, res) => {
    adminServices.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
    
  },
  postCategory: (req, res) => {
    adminServices.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      return res.redirect('/admin/categories')
    })
  },
  // putCategory: (req, res) => {
  //   adminServices.putCategory(req, res, (data) => {
  //     if(data['status'] === 'error') {
  //       req.flash('error_msg', data['message'])
  //       return res.redirect('back')
  //     }
  //     req.flash('success_msg', data['message'])
  //     return res.redirect('/admin/categories')
  //   })
  // },
  // deleteCategory: (req, res) => {
  //   adminServices.deleteCategory(req, res, (data) => {
  //     if(data['status'] === 'success') {
  //       return res.redirect('/admin/categories')
  //     }
  //   })
  // }
}

module.exports = categoryController