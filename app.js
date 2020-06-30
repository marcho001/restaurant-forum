const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout:'main', extname: 'hbs' }))
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log('now is running')
})