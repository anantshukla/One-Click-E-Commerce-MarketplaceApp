const constants = require("./constants");
let { defaultSuccessStatusCode, defaultErrorStatusCode } = constants;

const successAPIResponse = (req, res, msg, statusCode = defaultSuccessStatusCode) => {
	try {
		res.status(statusCode).json(successMessageStructure(msg));
	} catch (err) {
		console.log("Exception while sending success response to user in API " + req.url);
		console.log(err);
	}
};

const failureAPIResponse = (req, res, msg, statusCode = defaultErrorStatusCode) => {
	try {
		res.status(statusCode).json(failureMessageStructure(msg));
	} catch (err) {
		console.log("Error: " + msg + " in request: " + req.url);
		console.log(err);
	}
};

const successMessageStructure = (msg) => {
	return {
		message: msg,
		status: 1,
	};
};

const failureMessageStructure = (msg) => {
	return {
		message: msg,
		status: 0,
	};
};

module.exports = {
	successAPIResponse,
	failureAPIResponse,
};
