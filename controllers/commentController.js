const db = require('../models')
const Comment = db.Comment
let commentController = {
  postComment: (req, res) => {
    const { text, restaurantId } = req.body
    return Comment.create({
      text: text,
      RestaurantId: restaurantId,
      UserId: req.user.id
    })
    .then(comment => res.redirect(`/restaurants/${ restaurantId }`))
  }
}

module.exports = commentController