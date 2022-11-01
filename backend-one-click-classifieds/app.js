const express = require("express");
const app = express();

const port = 3001

function successMessage(msg) {
    return success = {
        message: msg,
        status: 1
    }
}

function failureMessage(msg) {
    return success = {
        message: msg,
        status: 0
    }
}


app.get('/', (req, res) => {
    res.json(successMessage('One Click Classifieds Rest API is running'));
})
  
  app.listen(port, () => {
    console.log(`One Click Classifieds Backend application is listening on port ${port}`)
  })