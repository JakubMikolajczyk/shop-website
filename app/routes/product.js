let express = require('express');
let router = express.Router();
let db = require("../database/database");



async function productDeleteHandler(req, res) {
    if (await db.ProductDatabase.delete(req.params.id)) {
        return res.redirect("/products")
    }
    else {
        return res.redirect("/products/" + req.params.id);
    }
}

router.get("/products/:id", async (req,res) => {
    let result = await db.ProductDatabase.read({id: req.params.id, valid: true});
    res.render("product_card", { user: { id: 2,  username: "Wiktor", isAdmin: true}, product: result[0] });
});

router.post("/products/:id", async function (req,res) {
    if (req.body.method == "DELETE") {
        return productDeleteHandler(req, res);
    }
    else if (req.body.method == "PUT") {
        res.send("PUT method");
    }
    else {
        res.send("POST method");
    }
});

//router.put()

router.delete("/products/:id", productDeleteHandler)



router.post("/products", async function (req, res) {

});

module.exports =  router;
