import { query, param, validationResult } from "express-validator";

function rejectBadValues(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
}

export const mapSearchFeatures = [
	query("lat")
		.escape().trim()
		.notEmpty().isFloat({min: -90, max: 90}),
	query("lon")
		.escape().trim()
		.notEmpty().isFloat({min: -180, max: 180}),
	query("radius")
		.escape().trim()
		.notEmpty().isFloat({min: 10, max: 10_000}),
	query("types")
		.trim().isWhitelisted(["t", "c", "r"]),
	rejectBadValues
];

export const mapGetSingle = [
	param("osm_id")
		.trim().notEmpty().isInt(),
	param("osm_type")
		.trim().notEmpty().isIn(["way","relation","node"]),
	rejectBadValues
];
