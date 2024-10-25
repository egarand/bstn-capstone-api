import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);

// || ROUTE HANDLERS - PoI MANAGEMENT

export async function getSavedPois(req, res) {
	try {
		// TODO validate JWT token, get real user id, return a 401 if no token, etc
		const user_id = 1;

		const poiList =
			await knex("saved_pois")
				.innerJoin("pois", "saved_pois.poi_id", "pois.id")
				.where({ "saved_pois.user_id": user_id })
				.select("pois.*");
		if (!poiList.length) {
			res.sendStatus(204);
		} else {
			res.send(poiList);
		}
	} catch (error) {
		res.status(500).send(error.message);
	}
}

export function savePoi(req, res) {
	res.sendStatus(501);
}

export function deletePoi(req, res) {
	res.sendStatus(501);
}

// || ROUTE HANDLERS - AUTH

export function register(req, res) {
	res.sendStatus(501);
}

export function login(req, res) {
	res.sendStatus(501);
}
