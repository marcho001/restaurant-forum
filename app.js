const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')

app.engine('hbs', exphbs({ defaultLayout:'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log('<code>Example app listening on port ${port}!</code>')
})
 
require('./routes')(app)