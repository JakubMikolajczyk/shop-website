
let db = await (await import("./database.mjs")).res;
console.log(await db.userRepo.read());

await db.conn.close();