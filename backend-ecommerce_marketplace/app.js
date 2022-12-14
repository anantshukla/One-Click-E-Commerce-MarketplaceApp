const express = require("express");
const app = express();

const constants = require("./commonUtils/constants");
const API_PORT = constants.API_PORT;
const logger = require("./commonUtils/logger");

const { successAPIResponse } = require("./commonUtils/responseInterface");

app.use(express.json());

// Whitelisting CORS requests from all domains
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Content-disposition, Accept, Authorization, User-Role"
	);
	next();
});

// Health Check API which can be used to ping the API Server to know if the Server is running or not
app.get("/", (req, res) => {
	successAPIResponse(req, res, "E-Commerce Marketplace Rest API responding");
});

// Router which handles Product Related APIs, introduced as part of refactoring
let userController = require("./Routes/UserRoutes");
app.use(userController);

// Router which handles Product Related APIs, introduced as part of refactoring
let productController = require("./Routes/ProductRoutes");
app.use(productController);

// Server hosted on port 3001
app.listen(API_PORT, () => {
	logger.createLog(`E-Commerce Marketplace Rest API is listening on port ${API_PORT}`);
});

// Global variable which stores the root directory
global.__rootdir = __dirname;

module.exports = app;
