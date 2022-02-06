let express = require('express');
let router = express.Router();
let db = require("../database/database");

router.post('/products/:id', async function (req,res){
    if (req.body.method == "DELETE") {
        res.send("DELETE method");
    }
    else if (req.body.method == "PUT") {
        res.send("PUT method");
    }
    else {
        res.send("POST method");
    }
})

router.post()

module.exports =  router;
