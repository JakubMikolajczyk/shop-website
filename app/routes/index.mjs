var express = await import('express')
var router = express.Router();
let db = await import("../database/database.mjs");

router.get('/', async function (req,res){
    let result = await db.userRepo.read();
    res.send(result);
})

export {router }