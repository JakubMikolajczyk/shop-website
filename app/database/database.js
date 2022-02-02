const mssql = require("mssql");

class UserDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(user = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (user.id) {
                req.input("id", user.id);
            }
            if (user.login) {
                req.input("login", user.login);
            }

            if (user.name) {
                req.input("name", user.name);
            }
            if (user.surname) {
                req.input("surname", user.surname);
            }
            if (user.phone) {
                req.input("phone", user.phone);
            }
            if (user.mail) {
                req.input("mail", user.mail);
            }

            if (user.street) {
                req.input("street", user.street);
            }
            if (user.number) {
                req.input("number", user.number);
            }
            if (user.postal) {
                req.input("postal", user.postal);
            }
            if (user.city) {
                req.input("city", user.city);
            }

            let res = await req.query(`select * from [USER]
                                       join [USER_DETAILS] on [USER].id = [USER_DETAILS].id
                                       join [USER_ADDRESS] on [USER].id = [USER_ADDRESS].id
                                       where 1 = 1` +
                                       (user.id ? " AND [USER].id = @id" : "") +
                                       (user.login ? " AND [USER].login = @login" : "") +
                                       (user.name ? " AND [USER_DETAILS].name = @name" : "") +
                                       (user.surname ? " AND [USER_DETAILS].surname = @surname" : "") +
                                       (user.phone ? " AND [USER_DETAILS].phone = @phone" : "") +
                                       (user.mail ? " AND [USER_DETAILS].mail = @mail" : "") +
                                       (user.street ? " AND [USER_DETAILS].street = @street" : "") +
                                       (user.number ? " AND [USER_DETAILS].number = @number" : "") +
                                       (user.postal ? " AND [USER_DETAILS].postal = @postal" : "") +
                                       (user.city ? " AND [USER_DETAILS].city = @city" : "")
                                       );
            let result =  res.recordset;
            result.map(user => {
                user.id = user.id[0];
                user.seed = BigInt(user.seed);
            })
            return result;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async add(user) {
        if (!user || !user.login || !user.password || !user.seed) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("login", user.login);
            req.input("password", user.password);
            req.input("seed", user.seed);
            let res = await req.query(`insert into [USER]
                                       (login, password, seed)
                                       values
                                       (@login, @password, @seed)
                                       select scope_identity() as id;
                                       `);

            let id = res.recordset[0].id;
            user.id = id;
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async addDetails(user) {
        if (!user || !user.id || !user.name || !user.surname || !user.phone || !user.mail) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", user.id);
            req.input("name", user.name);
            req.input("surname", user.surname);
            req.input("phone", user.phone);
            req.input("mail", user.mail);

            let res = await req.query(`insert into [USER_DETAILS]
                                       (id, name, surname, phone, mail)
                                       values
                                       (@id, @name, @surname, @phone, @mail)`
            );
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async addAddress(user) {
        if (!user || !user.id || !user.street || !user.number || !user.postal || !user.city) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", user.id);
            req.input("street", user.street);
            req.input("number", user.number);
            req.input("postal", user.postal);
            req.input("city", user.city);

            let res = await req.query(`insert into [USER_ADDRESS]
                                       (id, street, number, postal, city)
                                       values
                                       (@id, @street, @number, @postal, @city)`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async updateDetails(user) {
        if (!user || !user.id || !user.name || !user.surname || !user.phone || !user.mail) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", user.id);
            req.input("name", user.name);
            req.input("surname", user.surname);
            req.input("phone", user.phone);
            req.input("mail", user.mail);

            let res = await req.query(`update [USER_DETAILS]
                                       set 
                                       name=@name,
                                       surname=@surname,
                                       phone=@phone,
                                       mail=@mail
                                       where id=@id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async updateAddress(user) {
        if (!user || !user.id || !user.street || !user.number || !user.postal || !user.city) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", user.id);
            req.input("street", user.street);
            req.input("number", user.number);
            req.input("postal", user.postal);
            req.input("city", user.city);

            let res = await req.query(`update [USER_ADDRESS]
                                       set
                                       street=@street,
                                       number=@number,
                                       postal=@postal,
                                       city=@city
                                       where id=@id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async delete(id) {
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", id);
            let res = await req.query(`delete from [USER_DETAILS] where id=@id;
                                       delete from [USER_ADDRESS] where id=@id;
                                       delete from [USER] where id=@id`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

}

class ProductDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(product = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (product.id) {
                req.input("id", product.id);
            }
            if (product.name) {
                req.input("name", product.name);
            }
            if (product.price) {
                req.input("price", product.price);
            }
            if (product.amount) {
                req.input("amount", product.amount);
            }
            if (product.img_path) {
                req.input("img_path", product.img_path);
            }
            if (product.description) {
                req.input("description", product.description);
            }
            if (product.category_id) {
                req.input("category_id", product.category_id);
            }
            if (product.category) {
                req.input("category", product.category);
            }

            let res = await req.query(`select * from [PRODUCT] 
                                       join [CATEGORY] on [PRODUCT].category_id = [CATEGORY].id
                                       where 1 = 1` +
                                       (product.id ? " AND [PRODUCT].id = @id" : "") +
                                       (product.name ? " AND [PRODUCT].name = @name" : "") +
                                       (product.price ? " AND [PRODUCT].price = @price" : "") +
                                       (product.amount ? " AND [PRODUCT].amount = @amount" : "") +
                                       (product.img_path ? " AND [PRODUCT].img_path = @img_path" : "") +
                                       //(product.description ? " AND [PRODUCT].description = @description" : "") +
                                       (product.category_id ? " AND [CATEGORY].id = @category_id" : "") +
                                       (product.category ? " AND [CATEGORY].name = @category" : "")
                                       );
            let result = res.recordset
            result.map(product => {
                product.id = product.id[0];
                product.category = product.name[1];
                product.name = product.name[0];
            });
            return result;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async add(product) {
        if (!product || 
            product.name === undefined || 
            product.price === undefined || 
            product.amount === undefined || 
            product.img_path === undefined || 
            product.description === undefined || 
            product.category_id === undefined) {
                return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("name", product.name);
            req.input("price", product.price);
            req.input("amount", product.amount);
            req.input("img_path", product.img_path);
            req.input("description", product.description);
            req.input("category_id", product.category_id);

            let res = await req.query(`insert into [PRODUCT]
                                 (name, price, amount, img_path, description, category_id)
                                 values
                                 (@name, @price, @amount, @img_path, @description, @category_id)`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async update(product) {
        if (!product || 
            product.id === undefined ||
            product.name === undefined || 
            product.price === undefined || 
            product.amount === undefined || 
            product.img_path === undefined || 
            product.description === undefined || 
            product.category_id === undefined) {
                return false;
        }
        try {
            let req = mssql.Request(this.conn);
            req.input("id", product.id);
            req.input("name", product.name);
            req.input("price", product.price);
            req.input("amount", product.amount);
            req.input("img_path", product.img_path);
            req.input("description", product.description);
            req.input("category_id", product.category_id);

            let res = req.query(`update [PRODUCT]
                                 set
                                 name=@name,
                                 price=@price,
                                 amount=@amount,
                                 img_path=@img_path,
                                 description=@description,
                                 category_id=@category_id
                                 where id=@id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async delete(product) {
        //todo
    }
}

class OrderDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(order = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (order.id) {
                req.input("id", order.id);
            }
            if (order.user_id) {
                req.input("user_id", order.user_id);
            }
            if (order.date) {
                let d = new Date();
                if (order.date.year) {
                    req.input("year", order.date.year);
                }
                if (order.date.month) {
                    req.input("month", order.date.month);
                }
                if (order.date.day) {
                    req.input("day", order.date.day);
                }
                if (order.date.hours) {
                    req.input("hours", order.date.hours);
                }
                if (order.date.minutes) {
                    req.input("minutes", order.date.minutes);
                }
                if (order.date.seconds) {
                    req.input("seconds", order.date.seconds);
                }
            }
            if (order.status) {
                req.input("status", order.status);
            }

            let res = await req.query(`select * from [ORDER]
                                       where 1 = 1` +
                                       (order.id ? " AND [ORDER].id=@id" : "") +
                                       (order.user_id ? " AND [ORDER].user_id=@user_id" : "") +
                                        //  (order.date ? ` AND YEAR([ORDER].date)=@year
                                        //                  AND MONTH()` : "") +
                                        (order.status ? " AND [ORDER].status=@status" : "")
                                        );
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async add(order) {
        function dateToSQL(date) {
            return date.toISOString().slice(0, 19).replace('T', ' ');
        }

        if (!order || order.user_id === undefined || order.date === undefined || order.status === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", order.user_id);
            req.input("date", dateToSQL(order.date));
            req.input("status", order.status);

            let res = await req.query(`insert into [ORDER]
                                       (user_id, date, status)
                                       values
                                       (@user_id, @date, @status)`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async update(order) {
        if (!order || order.id === undefined || order.user_id === undefined || order.date === undefined || order.status === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", order.id);
            req.input("user_id", order.user_id);
            req.input("date", dateToSQL(order.date));
            req.input("status", order.status);

            let res = await req.query(`update [ORDER]
                                 set
                                 user_id=@user_id,
                                 date=@date,
                                 status=@status
                                 where id=@id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async delete(id) {
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", id);

            let res = await req.query(`delete from [ORDER_CONTENT] where order_id=@id;
                                       delete from [ORDER] where id=@id`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async getContent(order) {
        if (!order || order.id === undefined) {
            return [];
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", order.id);

            let res = await req.query(`select * from [ORDER_CONTENT]
                                       where id=@id`);
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
}

class CategoryDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(category = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (category.id !== undefined) {
                req.input("id", category.id);
            }
            if (category.name !== undefined) {
                req.input("name", category.name);
            }
            if (category.root_id !== undefined) {
                req.input("root_id", category.root_id);
            }

            let res = await req.query(`select * from [CATEGORY]
                                       where 1 = 1` +
                                       ("id" in category ? " AND id = @id" : "") +
                                       ("name" in category ? " AND name = @name" : "") +
                                       ("root_id" in category ? " AND root_id = @root_id" : "")
                                       );
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async add(category) {
        if (!category || !("name" in category)) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("name", category.name);
            if (category.root_id !== undefined) {
                req.input("root_id", category.root_id);
            }
            else {
                req.input("root_id", null);
            }

            let res = await req.query(`insert into [CATEGORY]
                                 (name, root_id)
                                 values
                                 (@name, @root_id)`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async update(category) {
        if(!category || !("id" in category) || !("name" in category)) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", category.id);
            req.input("name", category.name);
            if ("root_id" in category) {
                req.input("root_id", category.root_id);
            }
            else {
                req.input("root_id", null);
            }

            let res = await req.query(`update [CATEGORY]
                                       set
                                       name=@name,
                                       root_id=@root_id
                                       where id=@id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async delete(id) {
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", id);
            
            let res = await req.query(`delete from [CATEGORY] where id = @id`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async getChildren(category) {
        if(!category || !("id" in category)) {
            return [];
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", category.id);
            let res = await req.query(`select * from [CATEGORY]
                                       where [CATEGORY].root_id=@id`);
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
}

async function main() {
    let conn = new mssql.ConnectionPool("server=localhost,1433;database=weppo;user id=admin;password=admin;trustServerCertificate=true")
    try {
        await conn.connect();
        let userRepo = new UserDatabase(conn);
        let productRepo = new ProductDatabase(conn);
        let orderRepo = new OrderDatabase(conn);
        let categoryRepo = new CategoryDatabase(conn);

        let user = {
            id: 2,
            login: "qwerty",
            password: "admin",
            seed: 1234,
            street: "Kwiatowa",
            number: "13B",
            postal: "53601",
            city: "Wrocław",
            name: "Wiktor",
            surname: "Bukowski",
            mail: "w.bukowski",
            phone: "123456789"
        };

        let product = {
            id: 1,
            name: "Deska",
            price: 100,
            amount: 1000,
            img_path: "/path",
            description: "Zwykła deska.",
            category_id: 1
        };

        let order = {
            id: 2,
            user_id: 2,
            date: new Date(),
            status: 0
        };

        let category = {
            id: 1,
            name: "Meble",
            root_id: 1
        }

        let users = await userRepo.read();
        users.forEach(user => {
            console.log(user);
        });

        let products = await productRepo.read();
        products.forEach(product => {
            console.log(product);
        });

        let orders = await orderRepo.read();
        orders.forEach(order => {
            console.log(order);
        });

        await categoryRepo.delete(7);
        let categories = await categoryRepo.read();
        categories.forEach(category => {
            console.log(category);
        });

        conn.close();
    }
    catch (err) {
        conn.close();
        console.log(err);
    }
}

main();