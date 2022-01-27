let express = require('express')
let router = express.Router();


router.get('/login', function (req,res){
    res.render('login')
})

router.post('/login', function (req, res) {
    let test = req.body.user
    res.send(test)
})

module.exports = router