import bodyParser from "body-parser";
import express from "express"
let app = express()


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('view engine', 'ejs')
app.set('views', './views')
    
let router = (await import("./routes/index.mjs")).router;
app.use(router)


app.listen(3000)
