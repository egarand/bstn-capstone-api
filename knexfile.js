import "dotenv/config";

/**
* @type { Object.<string, import("knex").Knex.Config> }
*/
export default {
	client: "pg",
	connection: {
		host: process.env.DB_HOST,
		database: process.env.DB_LOCAL_DBNAME,
		user: process.env.DB_LOCAL_USER,
		password: process.env.DB_LOCAL_PASSWORD,
		charset: "utf8",
	},
	migrations: {
		directory : "./migrations",
	},
	seeds: {
		directory: "./seeds",
	}
};
