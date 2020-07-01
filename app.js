const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const db = require('./models')

app.engine('hbs', exphbs({ defaultLayout:'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret:'thisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user
  next()
})
app.use(passport.initialize())
app.use(passport.session())


app.listen(port, () => {
  console.log('<code>Example app listening on port ${port}!</code>')
})
 
require('./routes')(app, passport)