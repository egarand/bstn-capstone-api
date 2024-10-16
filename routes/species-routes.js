import express from "express";
import * as speciesController from "../controllers/species-controller.js";

const router = express.Router();

router.route("/")
	.get(speciesController.searchByLocation);

router.route("/:id")
	.get(speciesController.getSingleSpecies);

export default router;
