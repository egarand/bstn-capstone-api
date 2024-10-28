/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export async function seed(knex) {
	await knex('pois').del();
	await knex('pois').insert([
		{
			id: 1,
			name: "Lookout Trail",
			category: "trail",
			osm_id: 41285743,
			osm_type: "way"
		},
		{
			id: 2,
			name: "Lake of Two Rivers Campground",
			category: "campground",
			osm_id: 17154401,
			osm_type: "relation"
		}
	]);
};