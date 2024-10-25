import express from "express";
import apicache from "apicacheable";
import * as mapController from "../controllers/map-controller.js";
import * as validate from "../middleware/validation.js";
import { osmLimiter, osmSpeedLimiter } from "../middleware/rate-limiting.js";

const router = express.Router();
router.use(
	apicache("10 minutes"),
	osmLimiter,
	osmSpeedLimiter
);

router.route("/")
	.get(
		...validate.mapSearchFeatures,
		mapController.searchFeatures
	);

router.route("/:osm_type/:osm_id")
	.get(
		...validate.mapGetSingle,
		mapController.getSingleFeature
	);

export default router;
