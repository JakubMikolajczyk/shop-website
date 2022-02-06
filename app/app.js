let bodyParser = require('body-parser')
let express = require('express')
let mssql = require('mssql')
let cookieParser = require('cookie-parser')

let app = express()

app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'))
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(require('./routes/index'))
app.use('/users', require('./routes/login'))

mssql.connect("server=localhost,1433;database=weppo;user id=admin;password=admin;trustServerCertificate=true", err => {
    if ( err ) {
        console.log(err);
    }
    else {
        app.listen(3000);
    }
})