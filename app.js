const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverrice = require('method-override')
const db = require('./models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', exphbs({ defaultLayout:'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret:'thisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverrice('_method'))
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user
  next()
})


app.listen(PORT, () => {
  console.log('running')
})
 
require('./routes')(app, passport)