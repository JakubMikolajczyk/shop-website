let express = require('express');
let router = express.Router();
let db = require("../database/database");
let authorize = require("../authorize");

router.get("/", authorize.isUser, async (req, res) => {
    if (req.user.isAdmin) {
        let orders = await db.OrderDatabase.read();
        await Promise.all(orders.map(async (order) => {
            order.content = await db.OrderDatabase.getContent(order);
            order.user = (await db.UserDatabase.read({ id: order.user_id }))[0];
        }));
        return res.render("order_list", { array: orders, user: req.user });
    }
    else {
        return res.redirect("/orders/" + req.user.id);
    }
})

router.get("/:user_id", authorize.isUser, async (req, res) => {
    let orders = await db.OrderDatabase.read({user_id: req.user.user_id});
    await Promise.all(orders.map(async (order) => {
        order.content = await db.OrderDatabase.getContent(order);
        order.user = (await db.UserDatabase.read({ id: order.user_id }))[0];
    }));
    return res.render("order_list", { array: orders, user: req.user });
})

router.post("/:user_id", authorize.isUser, async (req, res) => {
    
});


module.exports = router;