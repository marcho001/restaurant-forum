const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: async (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    const findEmail = await User.findOne({ where: { email } })
    try {
      if (passwordCheck !== password) {
        req.flash('error_msg', '兩次密碼不同！')
        return res.redirect('/signup')
      } else {
        if (findEmail) {
          req.flash('error_msg', '已經註冊過了！')
          return res.redirect('/signup')
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          })
            .then(user => {
              req.flash('success_msg', '成功註冊！')
              res.redirect('/signin')
            })
            .catch(err => console.log('create err', err))
        }
      }
    } catch (err) {
      console.log(err)
    }
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_msg', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_msg', '已成功登出')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController