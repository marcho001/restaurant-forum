const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    // console.log(req.user.toJSON())
    return res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_msg', '已成功登出')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    res.render('userProfile', {
      user: req.user
    })
  },
  editUser: (req, res) => {
    res.render('editProfile', {
      user: req.user
    })
  },
  putUser: async (req, res) => {
    const { name, image } = req.body
    const { file } = req
    const id = req.params.id
    console.log(file)
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      const img = await imgur.uploadFile(file.path)
      console.log(img)
      return User.findByPk(id).then(user => {
        user.update({
          name,
          image: img.data.link
        }).then(user => {
          res.redirect(`/user/${id}`)
        })
      }) 
    } 
    return User.findByPk(id).then(user => {
      user.update({
        name,
        image
      })
    })  
  }
}

module.exports = userController