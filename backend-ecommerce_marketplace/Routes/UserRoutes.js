const express = require("express");
const userRouter = express.Router();

// For hashing password
const CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");

const db = require("../DB/db").getSqliteDatabaseConnection();
const logger = require("../commonUtils/logger");

const { successAPIResponse, failureAPIResponse } = require("../commonUtils/responseInterface");
const { getCurrentTimeInISO } = require("../commonUtils/commonUtilityFunctions");

// API to Create User
userRouter.post("/createUser", async (req, res) => {
	try {
		email = req.body.email;
		password = req.body.password;
		firstName = req.body.firstName;
		lastName = req.body.lastName;
		phoneNumber = req.body.phoneNumber;

		const hashedPassword = SHA256(password).toString(CryptoJS.enc.Base64);

		// Validate and make sure that phoneNumber, lastName, firstName, password, email are not empty
		if (
			email === null ||
			email === "" ||
			password === null ||
			password === "" ||
			firstName === null ||
			firstName === "" ||
			lastName === null ||
			lastName === "" ||
			phoneNumber === null ||
			phoneNumber === ""
		) {
			failureAPIResponse(req, res, "Input Fields Cannot be empty");
			logger.createExceptionLog(req, res, "Input Fields Cannot be empty");
			return;
		}

		emailList = await db.raw("SELECT id FROM USERS WHERE email = ?", [email]);
		phoneList = await db.raw("SELECT id FROM USERS WHERE phone = ?", [phoneNumber]);

		// Validate whether Email or Phone Number exists
		if (emailList.length !== 0 || phoneList.length !== 0) {
			failureAPIResponse(req, res, "Phone number or email address already exists");
			logger.createExceptionLog("Phone number or email address already exists");
			return;
		}

		let currentTime = getCurrentTimeInISO();

		let insertResponse = await db.raw(
			"INSERT INTO USERS (email, password, first_name, last_name, phone, created_on, created_by) VALUES(?, ?, ?, ?, ?, ?, ?) RETURNING id;",
			[email, hashedPassword, firstName, lastName, phoneNumber, currentTime, "System"]
		);

		if (insertResponse.length === 0) {
			failureAPIResponse(req, res, "Failure in creating user");
			logger.createExceptionLog("Failure in creating user");
		} else {
			successAPIResponse(req, res, "User Created successfully");
			logger.createLog("User Created successfully");
		}
	} catch (ex) {
		failureAPIResponse(req, res, "Failure in creating user");
		logger.createExceptionLog(ex);
	}
});

// API to Authenticate User
userRouter.post("/authenticateUser", async (req, res) => {
	try {
		let email = req.body.email;
		let password = req.body.password;

		const hashedPassword = SHA256(password).toString(CryptoJS.enc.Base64);

		if (email === null || password === null) {
			failureAPIResponse(req, res, "Username and Password cannot be empty");
			logger.createExceptionLog("Username and Password cannot be empty");
		}

		let userList = await db.raw("SELECT * FROM USERS WHERE email = ? AND password = ?", [email, hashedPassword]);

		if (userList.length === 0) {
			failureAPIResponse(req, res, "Authentication failed", 401);
			logger.createExceptionLog("Authentication failed");
		} else {
			successAPIResponse(req, res, "Authentication successful");
			logger.createLog("Authentication successful");
		}
	} catch (ex) {
		failureAPIResponse(req, res, "Failure to Authenticate User");
		logger.createExceptionLog(ex);
	}
});

module.exports = userRouter;
