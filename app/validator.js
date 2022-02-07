let userSetting = {
    login: 20,
    name: 20,
    surname: 30,
    phone: 9,
    mail: 30,
    street: 40,
    number: 10,
    postal: 5,
    city: 30
}

// {
//     nazwa 20 not null
//     cena int not null
//     ilosc int not null
//     sciezka 30
//     opis string not null
//     kategoria wybor z listy not null
// }

function validUser(user){
    let message = {}
    message.error = false

    if(user.phone.length !== 9){
        message.error = true
        message.phone = "Phone must contain exactly 9 numbers"
    }

    if(!Number(user.phone)){
        message.error = true
        message.phone = "Phone must be number"
    }

    if(user.postal.length !== 5){
        message.error = true
        message.postal = "Phone must contain exactly 5 numbers"
    }

    if(!Number(user.postal)){
        message.error = true
        message.postal = "Phone must be number"
    }

    for (let i in userSetting){
        if (user[i] === ''){
            message.error = true
            message[i] = i + " cannot be empty"
        }
        if (user[i].length > userSetting[i]){
            message.error = true
            message[i] = i + " is too long"
        }
    }

    if (user.password !== user.againpassword){
        message.error = true
        message.password = "Two difference "
    }

    if (user.password === '' || user.againpassword === ''){
        message.error = true
        message.password = "Password cannot be empty"
    }


    return message
}


function validProduct(product){

    let message = {};
    message.error = false;
    if (product.name > 20) {
        message.error = true;
        message.name = "Name can't be longer than 20 characters!";
    }
    if (product.name == "") {
        message.error = true;
        message.name = "Name mustn't be empty!";
    }
    if (product.price < 0) {
        message.error = true;
        message.price = "Price can't be negative!";
    }
    if (product.amount < 0) {
        message.error = true;
        message.amount = "Amount can't be negative!";
    }
    if (product.description == "") {
        message.error = true;
        message.description = "Description mustn't be empty!";
    }
    return message;
}
module.exports = {validUser, validProduct}