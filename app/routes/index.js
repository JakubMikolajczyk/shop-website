let express = require('express')
let router = express.Router();
let db = require("../database/database");


router.get('/', async function (req,res){
    let result = await db.UserDatabase.read();
    res.send(result);
})

module.exports =  router;
