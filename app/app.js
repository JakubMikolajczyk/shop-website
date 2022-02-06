let bodyParser = require("body-parser");
let express = require("express");
let app = express()
let mssql = require("mssql");

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('view engine', 'ejs')
app.set('views', './views')
    
let router = require("./routes/index.js");
app.use(router)

mssql.connect("server=localhost,1433;database=weppo;user id=admin;password=admin;trustServerCertificate=true", err => {
    if ( err ) {
        console.log(err);
    }
    else {
        app.listen(3000);
    }
})
