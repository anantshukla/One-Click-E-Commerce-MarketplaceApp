const express = require("express");
const app = express();

const port = 3001;
const defaultErrorStatusCode = 400;
const defaultSuccessStatusCode = 200;

app.use(express.json());


app.get('/', (req, res) => {
    successAPIResponse(req, res, 'One Click Classifieds Rest API is running')
})

app.post('/createUser', async (req, res) => {
    email = req.body.email;
    password = req.body.password;
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    phoneNumber = req.body.phoneNumber;

    
    emailList = await knex('USERS').select('*').where({email: email})
    phoneList = await knex('USERS').select('*').where({phone: phoneNumber})

    // Validate whether Email or Phone Number exists
    if(emailList.length !== 0 || phoneList.length !== 0) {
        console.log('Phone number or email address already exists');
        failureAPIResponse(req, res, 'Phone number or email address already exists');
        return;
    }
    else {
        // Validate and make sure that phoneNumber, lastName, firstName, password, email are not empty
        if(email === null, password === null, firstName  === null, lastName === null, phoneNumber === null) {
            failureAPIResponse(req, res, 'Input Fields Cannot be empty');
        }
        else {
            let insertResponse = await knex.insert({
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
                phone: phoneNumber,
            }).into('USERS').returning('id');

            if(insertResponse.length === 0) {
                failureAPIResponse(req, res, 'Failure in creating user profile');
            }
            else {
                successAPIResponse(req, res, 'User Created successfully');
            }
        }
    }
})
  
app.listen(port, () => {
    console.log(`One Click Classifieds Backend application is listening on port ${port}`)
})


const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "../sql/one_click_classifieds.sqlite"
    },
    useNullAsDefault: true,
});


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