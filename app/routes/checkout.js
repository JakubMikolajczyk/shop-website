let express = require('express')
let router = express.Router()
let db = require("../database/database")
let authorize = require('../authorize')

router.get('/', authorize.isUser, (req, res) => {
    return res.redirect('/checkout/' + req.user.id)
})

router.get('/:user_id', authorize.isUser, async (req, res) => {

    let result = await db.CartDatabase.getCart(req.params.user_id)
    res.render('checkout', {
        user: req.user,
        checkout: result
    })

})

router.post('/:user_id', authorize.isUser, async (req, res) => {

    if (req.body.method === 'DELETE'){
        return deleteCheckout(req,res)
    }

})

router.delete('/:user_id', authorize.isUser, deleteCheckout)

router.get('/:user_id/:product_id', authorize.isUser, async (req, res) => {
    let result = await db.CartDatabase.read({user_id: req.params.user_id, product_id: req.params.product_id})
    res.send(result)
})

router.post('/:user_id/:product_id', authorize.isUser, async (req, res) => {

    console.log("abc")

    if (req.body.method === 'DELETE'){
        return deleteProductFromCheckout(req, res)
    }
    else if (req.body.method === 'PUT'){
        return updateCheckout(req,res)
    }
    else {

        let checkout = await db.CartDatabase.read({
            user_id: req.params.user_id,
            product_id: req.params.product_id,
        })

        if (checkout.length == 0){
            if (await db.CartDatabase.add({
                user_id: req.params.user_id,
                product_id: req.params.product_id,
                amount: req.body.amount
            })){
                res.status(200).send()
            }
            else {
                res.status(404).send()
            }
        }
        else {
            await updateCheckout(req, res)
        }

    }

})

router.put('/:user_id/:product_id', authorize.isUser, updateCheckout)
router.delete('/:user_id/:product_id', authorize.isUser, deleteProductFromCheckout)


async function deleteCheckout(req, res){
    if(await db.CartDatabase.delete(req.params.id)){
        res.status(200).send()
    }
    else {
        res.status(404).send()
    }
}

async function deleteProductFromCheckout(req, res){
    if (await db.CartDatabase.remove({user_id: req.params.user_id, product_id: req.params.product_id})){
            res.status(200).send()
    }
    else {
        res.status(404).send()
    }
}

async function updateCheckout(req, res){

    console.log(req.body.amount)
    if (await db.CartDatabase.update({
        user_id: req.params.user_id,
        product_id: req.params.product_id,
        amount: req.body.amount
    })){
        res.status(200).send()
    }
    else {
        res.status(404).send()
    }
}

module.exports = router