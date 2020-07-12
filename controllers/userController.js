const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followship = db.Followship
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
  getUser: async (req, res) => {
    const id = req.params.id
    const commentedRest = await Comment.findAll({
      raw: true,
      nest: true,
      include: [{
        model: User,
        where: { id }
      }, Restaurant]
    })
    const totalRestInfo = commentedRest.map(item => {
      return {
        id: item.Restaurant.id,
        image: item.Restaurant.image
      }
    })  
    const set = new Set()
    const restInfo = totalRestInfo.filter(item => {
      return !set.has(item.id) ? set.add(item.id) : false
    })
    const totalComment = restInfo.length
    const user = await User.findByPk(id)
    return res.render('userProfile', {
      id: req.user.id,
      thisUser: user.toJSON(),
      totalComment,
      restInfo
    })  
    // return User.findByPk(id).then(user => {
    //   res.render('userProfile', {
    //     id: req.user.id,
    //     thisUser: user.toJSON() 
    //   })
    // })
  },
  editUser: (req, res) => {
    return res.render('editProfile', {
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
        try {
          const user = await User.findByPk(id)
          await user.update({
            name,
            image: img.data.link
          })
          req.flash('success_msg', '成功更新用戶資料')
          res.redirect(`/users/${user.id}`)

        } catch(err) {
          res.send(err)
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
      .catch(err => res.send(err)) 
    }
  },
  addFavorite: async (req, res) => {
    await Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
    return res.redirect('back')
  },
  removeFavorite: async (req, res) => {
    const favorite = await Favorite.findOne({ where: {
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }})
    await favorite.destroy()
    res.redirect('back')
  },
  getTopUser: async (req, res) => {
      let users = await User.findAll({
      include: [
        { model: User, as: 'Followers'}
      ]
    })
    users = users.map(user => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length,
      isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
    }))
    users = users.sort((a, b) => 
      b.FollowerCount - a.FollowerCount
    )
    return res.render('topUser', { users })
  },
  addFollowing: async (req, res) => {
    await Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
    return res.redirect('back')
  },
  removeFollowing: async (req, res) => {
    const followship = await Followship.findOne({ 
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
    await followship.destroy()
    return res.redirect('back')
  }
}

module.exports = userController