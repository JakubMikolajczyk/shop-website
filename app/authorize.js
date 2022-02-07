let db = require('./database/database')

async function any(req, res, next, skipNext = false){
    if(req.signedCookies.user){

            let result = await  db.UserDatabase.read({id: req.signedCookies.user})
            req.user = {
                login: result[0].login,
                isAdmin: result[0].isAdmin,
                id: result[0].id
            }
            if (!skipNext){
                next()
            }
    }
    else {
        req.user = {
            login: '',
            isAdmin: false,
            id: 0
        }

        if (!skipNext){
            next()
        }
    }
}


async function isAdmin(req, res, next){
    await any(req,res, next, true)

    if (req.user.isAdmin){
        next()
    }
    else {
        res.redirect('/')
    }
}

async function isUser(req, res, next){
    await any(req,res, next, true)

    if (req.user.id !== 0 && (req.user.id == req.params.user_id || req.user.isAdmin || req.params.user_id == undefined)){
        next()
    }
    else {
        res.redirect('/')
    }
}

async function isUnlogged(req, res, next){
    await any(req,res, next, true)

    if (req.user.id === 0){
        next()
    }
    else {
        res.redirect('/')
    }
}

module.exports = {any, isUser, isAdmin, isUnlogged}