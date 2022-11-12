class sqliteDatabase {
	constructor() {
		this.sqliteConnection = require("knex")({
			client: "sqlite3",
			connection: {
				filename: "../sql/e_commerce_marketplace.sqlite",
			},
			useNullAsDefault: true,
			pool: {
				min: 0,
				max: 10,
			},
		});
	}

	getSqliteDatabaseConnection = () => {
		return this.sqliteConnection;
	};
}

// Implemented Singleton Pattern for the Database
// This is creating a new Object and will export only the object to other packages importing it.
module.exports = new sqliteDatabase();
