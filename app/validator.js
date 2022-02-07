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

}





module.exports = {validUser, validProduct}