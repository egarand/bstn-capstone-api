import { query, param, check, validationResult } from "express-validator";

const validTaxa = ["Actinopterygii","Animalia","Amphibia","Arachnida","Aves","Chromista","Fungi","Insecta","Mammalia","Mollusca","Reptilia","Plantae","Protozoa"];

function rejectBadValues(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

function lat(name = "lat") {
	return check(name)
			.escape().trim()
			.notEmpty().isFloat({min: -90, max: 90});
}

function lon(name = "lon") {
	return check(name)
			.escape().trim()
			.notEmpty().isFloat({min: -180, max: 180});
}

export const mapSearchFeatures = [
	lat(),
	lon(),
	query("radius")
		.escape().trim()
		.notEmpty().isFloat({min: 10, max: 30_000}),
	query("types")
		.trim().matches(/^(?:[tcr]{1},?)+$/i),
	rejectBadValues
];

export const mapGetSingle = [
	param("osm_id")
		.trim().notEmpty().isInt(),
	param("osm_type")
		.trim().notEmpty().isIn(["way","relation","node"]),
	rejectBadValues
];

export const speciesSearchByLocation = [
	lat("north"),
	lat("south"),
	lon("west"),
	lon("east"),
	query("page")
		.optional()
		.trim().isInt({ min: 1 }),
	query("taxa")
		.escape().trim()
		.notEmpty()
		.matches(`^(?:(?:${validTaxa.join("|")}),?)+\$`, "i"),
	rejectBadValues
];

export const speciesGetSingle = [
	param("id")
		.trim().notEmpty().isInt(),
	rejectBadValues
];
