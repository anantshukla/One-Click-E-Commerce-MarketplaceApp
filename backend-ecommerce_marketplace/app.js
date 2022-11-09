const express = require("express");
const app = express();

var path = require('path');

// For hashing password
const CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");

// 
const axios = require('axios');


// To download the images of the products from Public API
let fs = require('fs'),
http = require('http'),
https = require('https');

var Stream = require('stream').Transform;

// API Constants
const port = 3001;
const defaultErrorStatusCode = 400;
const defaultSuccessStatusCode = 200;
const productImagesLocation = './assets/images'

app.use(express.json());

// Health Check API which can be used to ping the API Server to know if the Server is running or not
app.get('/', (req, res) => {
    successAPIResponse(req, res, 'One Click Classifieds Rest API is running')
})


// API to Create User

app.post('/createUser', async (req, res) => {
    email = req.body.email;
    password = req.body.password;
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    phoneNumber = req.body.phoneNumber;

    const hashedPassword = SHA256(password).toString(CryptoJS.enc.Base64);

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


// API to Authenticate User

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


// API that reads the public API and inserts data to our inventory
// https://fakestoreapi.com/

app.post('/addProductsToCatalog', async (req, res) => {
    try {
        const APILink = "https://fakestoreapi.com/products?limit=50"
        const responseFromGetProducts = (await axios.get(APILink)).data;

        for await (const eachProduct of responseFromGetProducts) {
            let currentTime = getCurrentTimeInISO();
            let {title, price,description,category,image} = eachProduct;
            category = category.replace(/['‘’"“”]/g, '')
            title = title.replace(/['‘’"“”]/g, '')
            description = description.replace(/['‘’"“”]/g, '')

            let categoryIdArr = await knex.raw(`SELECT id FROM CATEGORIES c WHERE c.name = '${category}'`);
            let categoryId;

            if(categoryIdArr.length !=  0) {
                categoryId = categoryIdArr[0].id;
            }
            else {  // Insert Category
                
                let categoryIdArr = await knex.raw(`INSERT INTO CATEGORIES(name, created_by, created_on) VALUES ('${category}', 'System', '${currentTime}') RETURNING id;`);
                categoryId = categoryIdArr[0].id;
            }

            let productIdInserted = await knex.raw(`INSERT INTO PRODUCTS(name, description, price, category_id, created_on, created_by) VALUES ('${title}', '${description}', ${price}, ${categoryId}, '${currentTime}', 'System') RETURNING id;`);
            productIdInserted = productIdInserted[0].id;

            const fileExtension = image.split('.').pop()
            await downloadImageFromUrl(image, `${productImagesLocation}/${productIdInserted}.${fileExtension}`) 

        };

        successAPIResponse(req, res, 'Products added successfully');
    }
    catch (ex){
        failureAPIResponse(req, res, 'Failure in creating advertisement');
    }

})

app.get('/getAllProductCategories', async (req, res) => {
    
    // Query that gets list of all the Categories from the db
    let categoriesList = await knex.raw(`
        SELECT id, name
        FROM CATEGORIES c
    `);

    // Converting array of single element to a json named categoriesDetails
    let categoriesDetails = {}
    categoriesDetails['productCategories'] = categoriesList;

    successAPIResponse(req, res, categoriesDetails);
})


app.post('/getAllProducts', async (req, res) => {

    let productList = await knex.raw(
        `SELECT p.id as productId,
                p.name as productName,
                p.description as productDescription,
                p.price,
                c.name as categoryName
        FROM PRODUCTS AS p
        LEFT JOIN CATEGORIES as c
            ON c.id = p.category_id;
    `);

    // Converting array of single element to a json named allProducts
    let allProducts = {}
    allProducts['products'] = productList;

    successAPIResponse(req, res, allProducts);
});


app.post('/getProductDetails', async (req, res) => {
    let productId = req.body.productId ? req.body.productId: 0;

    // Get details of a particular product id from the product table
    let productDetailsResponse = await knex.raw(
        `SELECT p.id as productId,
                p.name as productName,
                p.description as productDescription,
                p.price,
                c.name as categoryName
        FROM PRODUCTS AS p
        LEFT JOIN CATEGORIES as c
            ON c.id = p.category_id
        WHERE p.id = ${productId};
    `);

    // Converting array of single element to a json named advertisementDetails
    let productDetails = {}
    productDetails['advertisementDetails'] = productDetailsResponse[0];
    successAPIResponse(req, res, productDetails);
})

app.get('/getProductImage/:productId', async (req, res) => {
    var httpOptions = {
        root: path.join(__dirname)
    };
    productId = req.params.productId;
    filePath = `${productImagesLocation}/1.jpg`;
    res.sendFile(filePath, httpOptions, function (err) {
        if(err) {
            next(err);
        }
        else {
            console.log(`Image Sent: ${filePath}`)
        }
    })
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

const downloadImageFromUrl = (url, filename) => {

    var client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }

    client.request(url, function(response) {
        var data = new Stream();                                                    

      response.on('data', function(chunk) {                                       
         data.push(chunk);
      });                                       

      response.on('end', function() {                                             
         fs.writeFileSync(filename, data.read());                               
      });                                                                         
   }).end();
};

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