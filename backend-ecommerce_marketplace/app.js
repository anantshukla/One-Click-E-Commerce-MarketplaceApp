//TODO: image path

const express = require("express");
const app = express();

const constants = require("./commonUtils/constants");
let apiPort = constants.apiPort;

const { successAPIResponse } = require("./commonUtils/responseInterface");

app.use(express.json());

// Health Check API which can be used to ping the API Server to know if the Server is running or not
app.get("/", (req, res) => {
	successAPIResponse(req, res, "One Click Classifieds Rest API is running");
});

// Router which handles Product Related APIs, introduced as part of refactoring
let userController = require("./Routes/UserRoutes");
app.use(userController);

// Router which handles Product Related APIs, introduced as part of refactoring
let productController = require("./Routes/ProductRoutes");
app.use(productController);

// Server hosted on port 3001
app.listen(apiPort ? apiPort : 3001, () => {
	console.log(`E-Comm Application Backend is listening on port ${apiPort}`);
});

// Global variable which stores the root directory
global.__rootdir = __dirname;
