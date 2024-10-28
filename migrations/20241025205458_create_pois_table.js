/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export function up(knex) {
	return knex.schema.createTable("pois", (table) => {
		table.increments("id").primary();
		table.string("name", 128).notNullable();
		table.string("category", 16).notNullable();
		table.integer("osm_id").notNullable();
		table.string("osm_type", 10).notNullable();
		table.unique(["osm_id", "osm_type"], {
			indexName: "unique_pois_index",
			useConstraint: true
		});
	});
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export function down(knex) {
	return knex.schema.dropTable("pois");
};
