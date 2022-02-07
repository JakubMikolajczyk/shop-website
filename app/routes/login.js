let express = require('express')
let router = express.Router();
let validator = require('../validator')
let db = require("../database/database");
let bcrypt = require('bcrypt')
let authorize = require('../authorize')

router.get('/register', authorize.isUnlogged, (req, res) => {

        res.render('register',{
            user: req.user,
            message: {},
            prevValue: {}
        })

})

router.post('/register', authorize.isUnlogged, async (req, res) => {

    let message = validator.validUser(req.body)
    if (message.error){
        res.render('register',{
            user: req.user,
            message: message,
            prevValue: req.body
        })
    }
    else {
        req.body.password = await bcrypt.hash(req.body.password,12)
        req.body.isAdmin = false

        try {
            await db.UserDatabase.add(req.body)
            await db.UserDatabase.addDetails(req.body)
            await db.UserDatabase.addAddress(req.body)
            console.log("OK")
            return res.redirect('/')
        }
        catch (e){
            message.login = e.message
            res.render('register',{
                user: req.user,
                message: message,
                prevValue: req.body
            })
        }

    }


})

router.get('/login', authorize.isUnlogged, (req, res) =>{

    res.render('login',{
        user: req.user,
        message: ""
    })
})

router.post('/login', authorize.isUnlogged, async (req, res) => {

    let user = await db.UserDatabase.read({login: req.body.login})

    let isPasswordCorrect = user[0]!== undefined &&
        await bcrypt.compare(req.body.password, user[0].password)


    if (isPasswordCorrect){
        res.cookie('user', user[0].id, {signed: true})
        res.redirect('/')
    }
    else {
        res.render('login',{
            user: req.user,
            message: "Wrong login or password"
        })
    }

})

router.get('/logout', authorize.any, (req, res) => {
    res.cookie('user','', { maxAge: -1 });
    res.redirect('/')

})

module.exports = router
