import bcrypt from "bcrypt";

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export async function seed(knex) {
	// Deletes ALL existing entries
	await knex('users').del();
	await knex('users').insert([
		{
			id: 1,
			email: "example@example.com",
			password: bcrypt.hashSync("password", 10) // just for testing
		}
	]);
};