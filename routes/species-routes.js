import express from "express";
import apicache from "apicacheable";
import * as speciesController from "../controllers/species-controller.js";
import * as validate from "../middleware/validation.js";
import { inatLimiter, inatSpeedLimiter } from "../middleware/rate-limiting.js";

const router = express.Router();
router.use(
	apicache("10 minutes"),
	inatLimiter,
	inatSpeedLimiter
);

router.route("/")
	.get(
		...validate.speciesSearchByLocation,
		speciesController.searchByLocation
	);

router.route("/:id")
	.get(
		...validate.speciesGetSingle,
		speciesController.getSingleSpecies
	);

export default router;
