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
    return res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_msg', '已成功登出')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    const id = req.params.id
    User.findByPk(id).then(user => {
      res.render('userProfile', {
        id: req.user.id,
        thisUser: user.toJSON() 
      })
    })
  },
  editUser: (req, res) => {
    res.render('editProfile', {
      user: req.user
    })
  },
  putUser: (req, res) => {
    const { name } = req.body
    const { file } = req
    const id = req.params.id
        
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        console.log(img.data.link)
        try {
          const user = await User.findByPk(id)
          await user.update({
            name,
            image: img.data.link
          })
          req.flash('success_msg', '成功更新用戶資料')
          res.redirect(`/users/${id}`)

        } catch(err) {
          console.log(err)
        }
      })
    } else {
      return User.findByPk(id).then(user => {
        user.update({
          name,
          image: user.image
        }).then(user => {
          req.flash('success_messages', '成功更新用戶資訊！')
          return res.redirect(`/users/${user.id}`)
        })
      })  
    }
  }
}

module.exports = userController