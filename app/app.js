let bodyParser = require("body-parser");
let express = require("express");
let app = express()
let mssql = require("mssql");

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
    extended: true
}));

app.set('view engine', 'ejs')
app.set('views', './views')


app.use("/image", express.static("./database/photos"));
app.use(require("./routes/index.js"));
app.use(require("./routes/product.js"));

mssql.connect("server=localhost,1433;database=weppo;user id=admin;password=admin;trustServerCertificate=true", err => {
    if ( err ) {
        console.log(err);
    }
    else {
        app.listen(3000);
    }
})
