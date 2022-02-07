let express = require('express')
let router = express.Router();
let db = require('../database/database');
let authorize = require('../authorize')

router.get('/', authorize.any,(req,res) => {
    res.render('index',{
        user: req.user
    })
})

module.exports =  router;
