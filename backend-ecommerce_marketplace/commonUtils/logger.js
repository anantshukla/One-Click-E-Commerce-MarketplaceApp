class Logger {
	constructor() {
		this.logs = [];
	}

	get loggerLength() {
		return this.logs.length;
	}

	createLog(logMessage) {
		const currentTimestamp = new Date().toISOString();
		this.logs.push({ logMessage, currentTimestamp });
		console.log(`${currentTimestamp} - ${logMessage}`);
	}

	createExceptionLog(logMessage) {
		const currentTimestamp = new Date().toISOString();
		this.logs.push({ logMessage, currentTimestamp });
		console.log(`Exception - ${currentTimestamp} - ${logMessage}`);
	}
}

// Implemented Singleton Pattern for Logger
// This is creating a new Object and will export only the object to other packages importing it.
module.exports = new Logger();
