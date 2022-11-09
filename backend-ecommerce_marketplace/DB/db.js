const knex = require("knex")({
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

module.exports = knex;
