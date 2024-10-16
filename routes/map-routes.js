import express from "express";
import * as mapController from "../controllers/map-controller.js";

const router = express.Router();

router.route("/")
	.get(mapController.searchFeatures);

router.route("/:osm_type/:osm_id")
	.get(mapController.getSingleFeature);

export default router;
