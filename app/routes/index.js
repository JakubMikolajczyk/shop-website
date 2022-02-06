let express = require('express');
let router = express.Router();
let db = require("../database/database");


router.get('/', async function (req,res) {
    let products = await db.ProductDatabase.read();
    res.render("product_card", { product: products[0], user: {id: 2, username: "Wiktor", isAdmin: true} })
})

module.exports =  router;
