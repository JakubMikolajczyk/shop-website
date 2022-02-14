
let db = require("./app/database/database");
let mssql = require("mssql");

mssql.connect("server=localhost,1433;database=weppo;user id=admin;password=admin;trustServerCertificate=true",async err => {
    if ( err ) {
        console.log(err);
    }
    else {
        let cart = await db.ProductDatabase.search("ad");
        console.log(cart);
    }
})