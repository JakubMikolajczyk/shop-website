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
                req.input("login", login);
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
            return res.recordset;
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
        if(!user || !user.id || !user.name || !user.surname || !user.phone || !user.mail) {
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
        catch(err) {
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
                                       // czy na pewno?
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

}

async function main() {
    let conn = new mssql.ConnectionPool("server=localhost,1433;database=weppo;user id=admin;password=admin;trustServerCertificate=true")
    try {
        await conn.connect();
        let repo = new UserDatabase(conn);
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
        }
        let res = await repo.updateAddress(user);
        console.log(res);
        let users = await repo.read();
        users.forEach(user => {
            console.log(user);
        });
        conn.close();
    }
    catch (err) {
        conn.close();
        console.log(err);
    }
}

main();