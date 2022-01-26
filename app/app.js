let express = require('express')
let app = express()
let bodyParser = require('body-parser')


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(require('./routes/index'))


app.listen(3000)
