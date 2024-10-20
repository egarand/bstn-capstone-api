import express from "express";
import apicache from "apicacheable";
import * as mapController from "../controllers/map-controller.js";
import * as validate from "../middleware/validation.js";

const router = express.Router();

router.route("/")
	.get(
		apicache("15 minutes"),
		...validate.mapSearchFeatures,
		mapController.searchFeatures
	);

router.route("/:osm_type/:osm_id")
	.get(
		apicache("15 minutes"),
		...validate.mapGetSingle,
		mapController.getSingleFeature
	);

export default router;
