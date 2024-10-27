import bcrypt from "bcrypt";
import "dotenv/config";

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
			password: await bcrypt.hash("password", Number(process.env.SALT_ROUNDS)) // just for testing
		}
	]);
};