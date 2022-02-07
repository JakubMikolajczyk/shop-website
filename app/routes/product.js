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
let authorize = require("../authorize");

router.get("/products", authorize.any,  async (req, res) => {
    let products = await db.ProductDatabase.read({valid: 1});
    res.render("product_tile", {array: products, user: req.user});
});

router.post("/products", authorize.isAdmin, upload.single("image"), async (req, res) => {
    console.log(req.body);
    if (req.body.method == "PUT") {
        return productAddHandler(req, res);
    }
    else {
        let categories = await db.CategoryDatabase.read();
        res.render("product_editor", { user: req.user, message: {}, prev: {} })
    }
});

router.get("/products/:id", authorize.any, async (req,res) => {
    let result = await db.ProductDatabase.read({id: req.params.id, valid: true});
    if (result.length == 0) {
        return res.redirect("/");
    }
    res.render("product_card", { user: req.user, product: result[0] });
});

router.post("/products/:id", authorize.isAdmin, upload.single("image"), async (req,res) => {
    console.log(req.body);
    if (req.body.method == "DELETE") {
        return productDeleteHandler(req, res);
    }
    else if (req.body.method == "PUT") {
        req.body.id = req.params.id;
        return productEditHandler(req, res);
    }
    else {
        let result = await db.ProductDatabase.read({ valid: 1, id: req.params.id });
        if (result.length == 0) {
            return res.redirect("/");
        }
        let productToEdit = result[0];
        res.render("product_editor", { prev: productToEdit, user: req.user, message: {} });
    }
});

router.put("/products/:id", authorize.isAdmin, productEditHandler);
router.delete("/products/:id", authorize.isAdmin, productDeleteHandler);

async function productAddHandler(req, res) {
    let product = req.body;
    product.category_id = 1;
    let message = validators.validProduct(product);
    if (req.file === undefined) {
        message.error = true;
        message.file = "You must attach an image!";
    }
    if (message.error) {
        res.render("product_editor", { prev: product, user: req.user, message: message });
        await fs.promises.delete("./database/photos/" + req.file.filename);
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
                await fs.promises.delete("./database/photos/" + product.id + ".png");
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
