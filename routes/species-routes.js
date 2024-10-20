import express from "express";
import apicache from "apicacheable";
import * as speciesController from "../controllers/species-controller.js";
import * as validate from "../middleware/validation.js";

const router = express.Router();

router.route("/")
	.get(
		apicache("15 minutes"),
		...validate.speciesSearchByLocation,
		speciesController.searchByLocation
	);

router.route("/:id")
	.get(speciesController.getSingleSpecies);

export default router;
