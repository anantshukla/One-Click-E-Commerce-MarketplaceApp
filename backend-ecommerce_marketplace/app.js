const express = require("express");
const app = express();

let CryptoJS = require("crypto-js");
let SHA256 = require("crypto-js/sha256");

const port = 3001;
const defaultErrorStatusCode = 400;
const defaultSuccessStatusCode = 200;

app.use(express.json());

// Health Check API which can be used to ping the API Server to know if the Server is running or not
app.get('/', (req, res) => {
    successAPIResponse(req, res, 'One Click Classifieds Rest API is running')
})

app.post('/createUser', async (req, res) => {
    email = req.body.email;
    password = req.body.password;
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    phoneNumber = req.body.phoneNumber;

    const hashedPassword = SHA256(password).toString(CryptoJS.enc.Base64);
    // console.log(hashedPassword)

    emailList = await knex('USERS').select('id').where({email: email});
    phoneList = await knex('USERS').select('id').where({phone: phoneNumber});        
    
    // Validate whether Email or Phone Number exists
    if(emailList.length !== 0 || phoneList.length !== 0) {
        failureAPIResponse(req, res, 'Phone number or email address already exists');
        return;
    }

    // Validate and make sure that phoneNumber, lastName, firstName, password, email are not empty
    else if(email === null, password === null, firstName  === null, lastName === null, phoneNumber === null) {
        failureAPIResponse(req, res, 'Input Fields Cannot be empty');
    }
    else {
        let currentTime = getCurrentTimeInISO();

        let insertResponse = await knex.insert({
            email: email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            created_on: currentTime,
            created_by: 'System'
        }).into('USERS').returning('id');

        if(insertResponse.length === 0) {
            failureAPIResponse(req, res, 'Failure in creating user');
        }
        else {
            successAPIResponse(req, res, 'User Created successfully');
        }
    }
})

app.post('/authenticateUser', async (req, res) => {
    email = req.body.email;
    password = req.body.password;

    const hashedPassword = SHA256(password).toString(CryptoJS.enc.Base64);

    if(email === null, password === null) {
        failureAPIResponse(req, res, 'Username and Password cannot be empty');
    }

    userList = await knex('USERS').select('*').where({
        email: email,
        password: hashedPassword
    });
    if(userList.length === 0) {
        failureAPIResponse(req, res, 'Authentication failed', 401);
    }
    else {
        successAPIResponse(req, res, 'Authentication successful');
    }
})

app.post('/addProductsToSale', async (req, res) => {
    let advertisementName = req.body.advertisementName;
    let advertisementDescription = req.body.advertisementDescription;
    let advertisementPrice = req.body.advertisementPrice;
    let advertisementLocation = req.body.advertisementLocation;
    let sellerId = req.body.sellerId;
    let advertisementCategories = req.body.advertisementCategories;

    advertisementCategoriesString = advertisementCategories.join();

    // TODO: Validation to check if strings are empty
    
    let insertAdvertisementResponse = await knex("ADVERTISEMENTS")
    .insert({
        advertisement_name: advertisementName,
        description: advertisementDescription,
        price: advertisementPrice,
        location: advertisementLocation,
        advertisement_status: 1,
        seller_id: sellerId,
        categories: advertisementCategoriesString
    }).returning('id');
    
    if(insertAdvertisementResponse.length === 0) {
        failureAPIResponse(req, res, 'Failure in creating advertisement');
    }
    else {
        successAPIResponse(req, res, 'Advertisement Created Successfully');
    }
})

// app.post('/updateAdvertisementDetails', async (req, res) => {
//     let advertisementId = req.body.advertisementId;
//     let advertisementName = req.body.advertisementName;
//     let advertisementDescription = req.body.advertisementDescription;
//     let advertisementPrice = req.body.advertisementPrice;
//     let advertisementLocation = req.body.advertisementLocation;
//     let advertisementCategories = req.body.advertisementCategories;
//     let advertisementStatus = req.body.advertisementStatus;

//     advertisementCategoriesString = advertisementCategories.join();

//     // TODO: Validation to check if strings are empty
    
//     let insertAdvertisementResponse = await knex("ADVERTISEMENTS")
//     .update({
//         advertisement_name: advertisementName,
//         description: advertisementDescription,
//         price: advertisementPrice,
//         location: advertisementLocation,
//         advertisement_status: advertisementStatus,
//         categories: advertisementCategoriesString
//     })
//     .where({
//         id: advertisementId
//     })
//     .returning('id');
    
//     if(insertAdvertisementResponse.length === 0) {
//         failureAPIResponse(req, res, 'Failure in updating advertisement');
//     }
//     else {
//         successAPIResponse(req, res, 'Advertisement Updated Successfully');
//     }
// })


app.post('/getAllProductsForSale', async (req, res) => {
    let loggedinUserId = req.body.loggedinUserId ? req.body.loggedinUserId: 0;

    // Get all advertisements joined with the user table where
    // 1. Advert is active
    // 2. The logged in user doesnt see their own advertisement.  
    let advertisementList = await knex('ADVERTISEMENTS AS a')
    .select('*')
    .whereNot({
        'a.seller_id': loggedinUserId,
        'a.advertisement_status': 0
    })
    .leftJoin('USERS AS u', 'a.seller_id', 'u.id');
    
    let allAdvertisements = {}
    allAdvertisements['advertisements'] = advertisementList;

    successAPIResponse(req, res, allAdvertisements);
})

app.post('/getProductDetails', async (req, res) => {
    let productId = req.body.productId ? req.body.productId: 0;

    // Get details of a particular advertisement id joined with the user table 
    let advertisementResponse = await knex('ADVERTISEMENTS AS a')
    .select('*')
    .where({
        'a.id': advertisementId 
    })
    .leftJoin('USERS AS u', 'a.seller_id', 'u.id');

    // Converting array of single element to a json named advertisementDetails
    let advertisementDetails = {}
    advertisementDetails['advertisementDetails'] = advertisementResponse[0];
    successAPIResponse(req, res, advertisementDetails);
})

 
app.listen(port, () => {
    console.log(`One Click Classifieds Backend application is listening on port ${port}`)
})


const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "../sql/e_commerce_marketplace.sqlite"
    },
    useNullAsDefault: true,
});

const getCurrentTimeInISO = () => {
    return (new Date).toISOString();
}

const successMessage = (msg) => {
    return {
        message: msg,
        status: 1
    }
}

const failureMessage = (msg) => {
    return {
        message: msg,
        status: 0
    }
}

const successAPIResponse = (req, res, msg, statusCode=defaultSuccessStatusCode) => {
    try {
        // console.log(msg)
        res.status(statusCode).json(successMessage(msg));
    }
    catch(err) {
        console.log("Exception while sending success response to user in API " + req.url);
        console.log(err);
    }
};

const failureAPIResponse = (req, res, msg, statusCode=defaultErrorStatusCode) => {
    try {
        res.status(statusCode).json(failureMessage(msg))
    }
    catch(err) {
        console.log("Error: " + msg + " in request: " + req.url);
    }
}