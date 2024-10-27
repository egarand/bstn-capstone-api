import { query, param, body, check, validationResult } from "express-validator";

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
	rejectBadValues
];

export const speciesGetSingle = [
	param("id")
		.trim().notEmpty().isInt(),
	rejectBadValues
];

export const userSavePoi = [
	body("osm_id")
		.trim().notEmpty().isInt(),
	body("osm_type")
		.trim().notEmpty().isIn(["way","relation","node"]),
	body("name")
		.escape().trim().notEmpty(),
	rejectBadValues
];

export const userDeletePoi = [
	param("id")
		.trim().notEmpty().isInt(),
	rejectBadValues
];

export const userRegister = [
	body("email")
		.escape().trim()
		.notEmpty().isEmail(),
	body("password")
		.escape().trim()
		.notEmpty().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/),
	rejectBadValues
]
