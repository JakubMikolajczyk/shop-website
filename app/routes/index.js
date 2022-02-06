let express = require('express');
let router = express.Router();
let db = require("../database/database");


router.get('/', async function (req,res) {
    res.send("hello world!");
})

module.exports =  router;
