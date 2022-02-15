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

// router.post("/:user_id", authorize.isUser, async (req, res) => {
//
//     let cart = await db.CartDatabase.getCart(req.user.user_id);
//     let order = {user_id: req.user.user_id, date: new Date(), status: 0};
//     if (await db.OrderDatabase.add(order)) {
//         cart.forEach(async item => {
//             await db.OrderDatabase.addContent(order, item.product_id, item.user_amount);
//         })
//         res.status(200).send()
//     }
//     else {
//         res.status(404).send();
//     }
// });

router.post('/:user_id', authorize.isUser, async (req, res) => {

    if (await db.OrderDatabase.addV2({user_id: 2, date: new Date(), status: 0})){
        res.status(200).send()
    }
    else {
        res.status(404).send()
    }


})


module.exports = router;