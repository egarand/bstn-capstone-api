/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export function up(knex) {
	return knex.schema.createTable("users", (table) => {
		table.increments("id").primary();
		table.string("email", 60).notNullable();
		table.binary("password", 60).notNullable();
	});
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export function down(knex) {
	return knex.schema.dropTable("users");
};
