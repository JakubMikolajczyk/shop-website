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



// zwraca wszystkie produkty
router.get("/", authorize.any,  async (req, res) => {
    res.redirect("/products/search");
});


router.post("/", authorize.isAdmin, upload.single("image"), async (req, res) => {
    // tworzy nowy produkt
    if (req.body.method == "PUT") {
        return productAddHandler(req, res);
    }
    // zwraca kreator produktu
    else {
        //let categories = await db.CategoryDatabase.read();
        res.render("product_editor", { user: req.user, message: {}, prev: {} })
    }
});

router.get("/search", authorize.any, async (req, res) => {
    let products = await db.ProductDatabase.read({valid: 1});
    return res.render("product_tile", {array: products, user: req.user});
});

router.post("/search", authorize.any, async (req, res) => {
    let query = req.body.search;
    let products = await db.ProductDatabase.search(query);
    return res.render("product_tile", {array: products, user: req.user});
});

// zwraca kartę produktu
router.get("/:id", authorize.any, async (req,res) => {
    let result = await db.ProductDatabase.read({id: req.params.id, valid: true});
    res.render("product_card", { user: req.user, product: result[0], message: "" });
});


router.post("/:id", authorize.isAdmin, upload.single("image"), async (req,res) => {
    // usuwa dany produkt
    if (req.body.method == "DELETE") {
        return productDeleteHandler(req, res);
    }
    // aktualizuje produkt
    else if (req.body.method == "PUT") {
        return productEditHandler(req, res);
    }
    // zwraca formularz edycji przedmiotu
    else {
        let product = await db.ProductDatabase.read({id: req.params.id});
        res.render("product_editor", { user: req.user, message: {}, prev: product[0] });
    }
});

router.put("/:id", authorize.isAdmin, productEditHandler);
router.delete("/:id", authorize.isAdmin, productDeleteHandler);



async function productAddHandler(req, res) {
    let product = req.body;
    product.category_id = 1;
    let message = validators.validProduct(product);
    if (req.file === undefined) {
        message.error = true;
        message.file = "You must attach an image!";
    }
    if (message.error) {
        await fs.promises.unlink("./database/photos/" + req.file.filename);
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
    product.id = req.params.id;
    product.category_id = 1;

    let message = validators.validProduct(product);
    if (message.error) {
        return res.render("product_editor", { prev: product, user: req.user, message: message});
    }
    else {
        if (await db.ProductDatabase.update(product)) {
            if (req.file !== undefined) {
                await fs.promises.unlink(`./database/photos/${product.id}.png`);
                await fs.promises.rename("./database/photos/" + req.file.filename, "./database/photos/" + product.id + ".png");
            }
            return res.redirect("/products");
        }
        else {
            console.log("Couldnt update");
        }
    }
    return res.redirect("/products");
}

async function productDeleteHandler(req, res) {
    if (await db.ProductDatabase.delete(req.params.id)) {
        return res.redirect("/products")
    }
    else {
        let product = await db.ProductDatabase.read({id: req.params.id});
        return res.render("product_card", {user: req.user, message: "Couldn't delete this item.", product: product});
    }
}

module.exports =  router;
