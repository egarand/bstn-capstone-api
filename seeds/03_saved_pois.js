/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export async function seed(knex) {
	await knex('saved_pois').del();
	await knex('saved_pois').insert([
		{
			id: 1,
			user_id: 1,
			poi_id: 2
		},
		{
			id: 2,
			user_id: 1,
			poi_id: 1
		}
	]);
};