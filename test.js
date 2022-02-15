
let db = require("./app/database/database");
let mssql = require("mssql");

mssql.connect("server=localhost,1433;database=weppo;user id=admin;password=admin;trustServerCertificate=true", async err => {
    if ( err ) {
        console.log(err);
    }
    else {
        let res = await db.OrderDatabase.addContent({id:1002}, 2003, 1);
        console.log(res);
    }
})