/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export function up(knex) {
	return knex.schema.createTable("saved_pois", (table) => {
		table.increments("id").primary();
		table
			.integer("user_id")
			.unsigned()
			.references("users.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table
			.integer("poi_id")
			.unsigned()
			.references("pois.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.unique(["user_id", "poi_id"], {
			indexName: "unique_bookmarks_index",
			useConstraint: true
		});
	});
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export function down(knex) {
	return knex.schema.dropTable("saved_pois");
};
