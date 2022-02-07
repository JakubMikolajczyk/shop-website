let express = require('express');
let router = express.Router();
let db = require("../database/database");
let multer = require("multer");
let fs = require("fs");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./database/photos");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ ".png");
    }
})
let upload = multer( {storage: storage} );
let validators = require("../validator");
const e = require('express');

router.get("/products", async (req, res) => {
    let products = await db.ProductDatabase.read({valid: 1});
    res.render("product_tile", {array: products, user: { id: 2,  username: "Wiktor", isAdmin: true}});
});

router.post("/products", upload.single("image"), async (req, res) => {
    console.log(req.body);
    if (req.body.method == "PUT") {
        return productAddHandler(req, res);
    }
    else {
        let categories = await db.CategoryDatabase.read();
        res.render("product_editor", { user: { id: 2,  username: "Wiktor", isAdmin: true}, message: {}, prev: {} })
    }
});

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

router.delete("/products/:id", productDeleteHandler);

async function productAddHandler(req, res) {
    let product = req.body;
    product.category_id = 1;
    let message = validators.validProduct(product);
    if (req.file === undefined) {
        message.error = true;
        message.file = "You must attach an image!";
    }
    if (message.error) {
        await fs.promises.delete("./database/photos/" + req.file.filename);
        res.render("product_editor", { prev: product, user: req.user, message: message });
    }
    else {
        if (await db.ProductDatabase.add(product)) {
            await fs.promises.rename("./database/photos/" + req.file.filename, "./database/photos/" + product.id + ".png");
            return res.redirect("/products");
        }
    }
    return res.redirect("/products");
}

async function productEditHandler(req, res) {
    let product = req.body;
    product.category_id = 1;
    let message = validators.validProduct(product);
    if (message.error) {
        res.render("product_editor", { prev: product, user: req.user, message: message});
    }
    else {
        console.log(product);
        if (await db.ProductDatabase.update(product)) {
            if (req.file !== undefined) {
                await fs.promises.delete(`./database/photos/${product.id}.png`);
                await fs.promises.rename("./database/photos/" + req.file.filename, "./database/photos/" + product.id + ".png");
            }
            return res.redirect("/products");
        }
    }
    return res.redirect("/products");
}

async function productDeleteHandler(req, res) {
    if (await db.ProductDatabase.delete(req.params.id)) {
        return res.redirect("/products")
    }
    else {
        return res.redirect("/products/" + req.params.id);
    }
}

module.exports =  router;
