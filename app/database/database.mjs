
const fs = await import("fs");
import mssql from "mssql";

class UserDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(user = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (user.id !== undefined) {
                req.input("id", user.id);
            }
            if (user.login !== undefined) {
                req.input("login", user.login);
            }
            if (user.valid !== undefined) {
                req.input("valid", user.valid ? 1 : 0);
            }


            if (user.name !== undefined) {
                req.input("name", user.name);
            }
            if (user.surname !== undefined) {
                req.input("surname", user.surname);
            }
            if (user.phone !== undefined) {
                req.input("phone", user.phone);
            }
            if (user.mail !== undefined) {
                req.input("mail", user.mail);
            }

            if (user.street !== undefined) {
                req.input("street", user.street);
            }
            if (user.number !== undefined) {
                req.input("number", user.number);
            }
            if (user.postal !== undefined) {
                req.input("postal", user.postal);
            }
            if (user.city !== undefined) {
                req.input("city", user.city);
            }
            
            let res = await req.query(`select * from [USER]
                                       left join [USER_DETAILS] on [USER].id = [USER_DETAILS].id
                                       left join [USER_ADDRESS] on [USER].id = [USER_ADDRESS].id
                                       where 1 = 1` +
                                       (user.id !== undefined       ? " AND [USER].id = @id"                    : "") +
                                       (user.login !== undefined    ? " AND [USER].login = @login"              : "") +
                                       (user.valid !== undefined    ? " AND [USER].valid = @valid"              : "") +
                                       (user.name !== undefined     ? " AND [USER_DETAILS].name = @name"        : "") +
                                       (user.surname !== undefined  ? " AND [USER_DETAILS].surname = @surname"  : "") +
                                       (user.phone !== undefined    ? " AND [USER_DETAILS].phone = @phone"      : "") +
                                       (user.mail !== undefined     ? " AND [USER_DETAILS].mail = @mail"        : "") +
                                       (user.street !== undefined   ? " AND [USER_DETAILS].street = @street"    : "") +
                                       (user.number !== undefined   ? " AND [USER_DETAILS].number = @number"    : "") +
                                       (user.postal !== undefined   ? " AND [USER_DETAILS].postal = @postal"    : "") +
                                       (user.city !== undefined     ? " AND [USER_DETAILS].city = @city"        : "")
                                       );
            let result =  res.recordset;
            result.map(user => {
                user.id = user.id[0];
                //user.seed = (user.seed);
            })
            return result;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async add(user) {
        if (!user || user.login === undefined || user.password === undefined || user.seed === undefined || user.isAdmin === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("login", user.login);
            req.input("password", user.password);
            req.input("seed", user.seed);
            req.input("isAdmin", user.isAdmin ? 1 : 0);
            let res = await req.query(`insert into [USER]
                                       (login, password, seed, isAdmin, valid)
                                       values
                                       (@login, @password, @seed, @isAdmin, 1)
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
        if (!user || user.id === undefined || user.name === undefined || user.surname === undefined || user.phone === undefined || user.mail === undefined) {
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
        if (!user || user.id === undefined || user.street === undefined || user.number === undefined || user.postal === undefined || user.city === undefined) {
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
        if (!user || user.id === undefined || user.name === undefined || user.surname === undefined || user.phone === undefined || user.mail === undefined) {
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
        if (!user || user.id === undefined || user.street === undefined || user.number === undefined || user.postal === undefined || user.city === undefined) {
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
            let res = await req.query(`update [USER]
                                       set 
                                       valid = 0
                                       where id = @id`);
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
            if (product.id !== undefined) {
                req.input("id", product.id);
            }
            if (product.name !== undefined) {
                req.input("name", product.name);
            }
            if (product.price !== undefined) {
                req.input("price", product.price);
            }
            if (product.amount !== undefined) {
                req.input("amount", product.amount);
            }
            if (product.img_path !== undefined) {
                req.input("img_path", product.img_path);
            }
            if (product.description !== undefined) {
                req.input("description", product.description);
            }
            if (product.category_id !== undefined) {
                req.input("category_id", product.category_id);
            }
            if (product.category !== undefined) {
                req.input("category", product.category);
            }
            if (product.valid !== undefined) {
                req.input("valid", product.valid ? 1 : 0);
            }

            let res = await req.query(`select * from [PRODUCT] 
                                       join [CATEGORY] on [PRODUCT].category_id = [CATEGORY].id
                                       where 1 = 1` +
                                       (product.id !== undefined ? " AND [PRODUCT].id = @id" : "") +
                                       (product.name !== undefined ? " AND [PRODUCT].name = @name" : "") +
                                       (product.price !== undefined ? " AND [PRODUCT].price = @price" : "") +
                                       (product.amount !== undefined ? " AND [PRODUCT].amount = @amount" : "") +
                                       (product.img_path !== undefined ? " AND [PRODUCT].img_path = @img_path" : "") +
                                       //(product.description ? " AND [PRODUCT].description = @description" : "") +
                                       (product.category_id !== undefined ? " AND [CATEGORY].id = @category_id" : "") +
                                       (product.category !== undefined ? " AND [CATEGORY].name = @category" : "") + 
                                       (product.valid !== undefined ? " AND [PRODUCT].valid = @valid" : "")
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
                                 (name, price, amount, img_path, description, category_id, valid)
                                 values
                                 (@name, @price, @amount, @img_path, @description, @category_id, 1)`);
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

    async delete(id) {
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", id);
            let res = await req.query(`update [PRODUCT]
                                       set 
                                       valid=0
                                       where id=@id`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async addTag(product, tag) {
        if (product.id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", product.id);
            req.input("tag", tag);

            let res = await req.query(`insert into [PRODUCT_TAGS]
                                       (product_id, tags)
                                       values
                                       (@id, @tag);`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async removeTag(product, tag) {
        if (product.id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", product.id);
            req.input("tag", tag);
            let res = await req.query(`delete from [PRODUCT_TAGS]
                                       where product_id = @id AND tag = @tag`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async getByTags(tags, applyAND = false) {
        try {
            let req = new mssql.Request(this.conn);
            let query = `select * from [PRODUCT]
                         join [PRODUCT_TAGS] on [PRODUCT].id = [PRODUCT_TAGS].product_id
                         where ${applyAND ? 1 : 0} = 1`;
            
            let operator = applyAND ? "AND" : "OR";
            for(let i = 0; i < tags.length; i++) {
                req.input("@" + i, tags[i]);
                query += ` ${operator} [PRODUCT_TAGS].tag = @${i}`;
            }
            
            let res = await req.query(query);
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
}

class OrderDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(order = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (order.id !== undefined) {
                req.input("id", order.id);
            }
            if (order.user_id !== undefined) {
                req.input("user_id", order.user_id);
            }
            if (order.date !== undefined) {
                // todo
            }
            if (order.status !== undefined) {
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

    async addContent(order, product_id, amount) {
        if (!order || order.id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("order_id", order.id);
            req.input("product_id", product_id);
            req.input("amount", amount);
            let res = await req.query(`insert into [ORDER_CONTENT]
                                       (order_id, product_id, amount)
                                       values
                                       (@order_id, @product_id, @amount)`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async editContentAmount(order, product_id, amount) {
        if(!order || order.id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("order_id", order.id);
            req.input("product_id", product_id);
            req.input("amount", amount);
            let res = await req.query(`update [ORDER_CONTENT]
                                       set
                                       amount=@amount
                                       where
                                       order_id = @order_id AND
                                       product_id = @product_id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async removeContent(order, product_id) {
        if(!order || order.id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("order_id", order.id);
            req.input("product_id", product_id);
            req.input("amount", amount);
            let res = await req.query(`delete from [ORDER_CONTENT]
                                       where
                                       order_id = @order_id AND
                                       product_id = @product_id`);
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
        if (!category || category.name === undefined) {
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
        if(!category || category.id === undefined || category.name === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("id", category.id);
            req.input("name", category.name);
            if (category.root_id !== undefined) {
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
        if(!category || category.id === undefined) {
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

class CartDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(cart = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (cart.user_id !== undefined) {
                req.input("user_id", cart.user_id);
            }
            if (cart.product_id !== undefined) {
                req.input("product_id", cart.product_id);
            }
            if (cart.amount !== undefined) {
                req.input("amount", cart.amount);
            }

            let res = await req.query(`select * from [CART]
                                       where 1 = 1` +
                                       (cart.user_id    !== undefined ? " AND user_id = @user_id"       : "") +
                                       (cart.product_id !== undefined ? " AND product_id = @product_id" : "") +
                                       (cart.amount     !== undefined ? " AND amount = @amount"         : "")
                                       );
            return res.recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async add(cartElement) {
        if(!cartElement || cartElement.user_id === undefined || cartElement.product_id === undefined || cartElement.amount === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", cartElement.user_id);
            req.input("product_id", cartElement.product_id);
            req.input("amount", cartElement.amount);

            let res = await req.query(`insert into [CART]
                                       (user_id, product_id, amount)
                                       values
                                       (@user_id, @product_id, @amount)`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async update(cartElement) {
        if(!cartElement || cartElement.user_id === undefined || cartElement.product_id === undefined || cartElement.amount === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", cartElement.user_id);
            req.input("product_id", cartElement.product_id);
            req.input("amount", cartElement.amount);

            let res = await req.query(`update [CART]
                                       set
                                       amount = @amount
                                       where user_id = @user_id AND product_id = @product_id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async delete(user_id) {
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", user_id);
            let res = await req.query(`delete from [CART] where user_id = @user_id;`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async remove(cartElement) {
        if(!cartElement || cartElement.user_id === undefined || cartElement.product_id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", cartElement.user_id);
            req.input("product_id", cartElement.product_id);

            let res = await req.query(`delete from [CART]
                                       where user_id = @user_id AND product_id = @product_id`);
            return res.rowsAffected[0] != 0;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}

class FavouriteDatabase {
    constructor(conn) {
        this.conn = conn;
    }

    async read(favourite = {}) {
        try {
            let req = new mssql.Request(this.conn);
            if (favourite.user_id !== undefined) {
                req.input("user_id", favourite.user_id);
            }
            if (favourite.product_id !== undefined) {
                req.input("product_id", favourite.product_id);
            }

            let res = req.query(`select * from [FAVOURITE]
                                 where 1 = 1` +
                                 (favourite.user_id !== undefined       ? " AND user_id = @user_id"         : "") +
                                 (favourite.product_id !== undefined    ? " AND product_id = @product_id"   : "")
                                 );
            return (await res).recordset;
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }

    async add(favourite) {
        if(!favourite || favourite.user_id === undefined || favourite.product_id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", favourite.user_id);
            req.input("product_id", favourite.product_id);

            let res = await req.query(`insert into [FAVOURITE]
                                       (user_id, product_id)
                                       values
                                       (@user_id, @product_id)`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async delete(user_id) {
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", user_id);
            let res = await req.query(`delete from [FAVOURITE] where user_id = @user_id;`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    async remove(favourite) {
        if(!favourite || favourite.user_id === undefined || favourite.product_id === undefined) {
            return false;
        }
        try {
            let req = new mssql.Request(this.conn);
            req.input("user_id", favourite.user_id);
            req.input("product_id", favourite.product_id);

            let res = await req.query(`delete from [FAVOURITE]
                                       where user_id = @user_id AND product_id = @product_id)`);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}


let userRepo, productRepo, orderRepo, categoryRepo, cartRepo, favouriteRepo, conn;

async function create() {
    let connectionString = await fs.promises.readFile("./connection-string.txt", "utf-8"); 
    conn = new mssql.ConnectionPool(connectionString);
    try {
        await conn.connect();
        userRepo = new UserDatabase(conn);
        productRepo = new ProductDatabase(conn);
        orderRepo = new OrderDatabase(conn);
        categoryRepo = new CategoryDatabase(conn);
        cartRepo = new CartDatabase(conn);
        favouriteRepo = new FavouriteDatabase(conn);
    }
    catch (err) {
        conn.close();
        console.log(err);
    }
}

await create();
export { userRepo, productRepo, orderRepo, categoryRepo, cartRepo, favouriteRepo, conn } ;
