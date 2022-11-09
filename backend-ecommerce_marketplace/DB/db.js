const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: "../sql/e_commerce_marketplace.sqlite",
	},
	useNullAsDefault: true,
});

module.exports = knex;
