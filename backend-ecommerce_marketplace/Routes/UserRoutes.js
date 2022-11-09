const express = require("express");
const userRouter = express.Router();

// For hashing password
const CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");

const knex = require("../DB/db");

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

		emailList = await knex("USERS").select("id").where({ email: email });
		phoneList = await knex("USERS").select("id").where({ phone: phoneNumber });

		// Validate whether Email or Phone Number exists
		if (emailList.length !== 0 || phoneList.length !== 0) {
			failureAPIResponse(req, res, "Phone number or email address already exists");
			return;
		}

		// Validate and make sure that phoneNumber, lastName, firstName, password, email are not empty
		else if (email === null || password === null || firstName === null || lastName === null || phoneNumber === null) {
			failureAPIResponse(req, res, "Input Fields Cannot be empty");
		} else {
			let currentTime = getCurrentTimeInISO();

			let insertResponse = await knex
				.insert({
					email: email,
					password: hashedPassword,
					first_name: firstName,
					last_name: lastName,
					phone: phoneNumber,
					created_on: currentTime,
					created_by: "System",
				})
				.into("USERS")
				.returning("id");

			if (insertResponse.length === 0) {
				failureAPIResponse(req, res, "Failure in creating user");
			} else {
				successAPIResponse(req, res, "User Created successfully");
			}
		}
	} catch (ex) {
		failureAPIResponse(req, res, "Failure in creating user");
	}
});

// API to Authenticate User
userRouter.post("/authenticateUser", async (req, res) => {
	try {
		email = req.body.email;
		password = req.body.password;

		const hashedPassword = SHA256(password).toString(CryptoJS.enc.Base64);

		if (email === null || password === null) {
			failureAPIResponse(req, res, "Username and Password cannot be empty");
		}

		userList = await knex("USERS").select("*").where({
			email: email,
			password: hashedPassword,
		});

		if (userList.length === 0) {
			failureAPIResponse(req, res, "Authentication failed", 401);
		} else {
			successAPIResponse(req, res, "Authentication successful");
		}
	} catch (ex) {
		failureAPIResponse(req, res, "Failure to Authenticate User");
	}
});

module.exports = userRouter;
