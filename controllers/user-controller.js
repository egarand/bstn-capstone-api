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

export async function savePoi(req, res) {
	const { osm_id, osm_type, name } = req.body;
	try {
		// TODO validate JWT token, get real user id, return a 401 if no token, etc
		const user_id = 1;

		await knex.transaction(async (trx) => {
			// create poi in pois table if it doesn't exist
			await trx("pois")
				.insert({ osm_id, osm_type, name })
				.onConflict(["osm_id", "osm_type"])
				.ignore();

			const poi =
				await trx("pois")
					.where({ osm_id, osm_type })
					.select("*")
					.first();

			await trx("saved_pois")
				.insert({ user_id, poi_id: poi.id });

			res.status(201).send(poi);
		});
	} catch (error) {
		// postgres error code for violated unique constraint
		if (error.code === "23505") {
			res.status(409).send("Can't bookmark the same location twice");
		} else {
			res.sendStatus(500);
		}
	}
}

export async function deletePoi(req, res) {
	const { id: poi_id } = req.params;
	try {
		// TODO validate JWT token, get real user id, return a 401 if no token, etc
		const user_id = 1;

		await knex.transaction(async (trx) => {
			const poi = await trx("saved_pois")
				.where({ user_id, poi_id })
				.first();
			if (!poi) {
				return res.sendStatus(404);
			}

			await trx("saved_pois").where({ user_id, poi_id }).del();

			// if no users have this location bookmarked anymore, we don't
			// need it anymore; so delete it.
			const count =
				(await trx("saved_pois")
					.where({ poi_id })
					.count()
				)[0].count;
			if (count === "0") {
				await trx("pois").where({ id: poi_id }).del();
			}
			res.sendStatus(204);
		});
	} catch (error) {
		res.sendStatus(500);
	}
}

// || ROUTE HANDLERS - AUTH

export function register(req, res) {
	res.sendStatus(501);
}

export function login(req, res) {
	res.sendStatus(501);
}
