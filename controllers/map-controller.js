import axios from "axios";
import gpsUtil from "gps-util";

// || OVERPASS API QUERIES

const overpassURL = "https://overpass-api.de/api/interpreter";

const trailsQuery =
`(
	wr[!canoe][!portage][name][route~"hiking|bicycle"];
	wr[!canoe][!portage][name][highway~"footway|cycleway|path"][sac_scale~"hiking"];
	<<;
);
out geom qt;`;

const reservesQuery =
`wr[leisure^nature_reserve];
out geom qt;`;

const campgroundsQuery =
`(
	wr[name][tourism^camp_site];
	wr[name][camp_site];
);
out geom qt;`;

function translateOSMData(element) {
	const result = {
		osm_type: element.type,
		osm_id: element.id,
		tags: element.tags
	};
	if (element.type === "relation") {
		result.geometry =
			element.members.map(
				(member) => member.geometry
			);
	} else if (element.type === "way") {
		result.geometry = element.geometry;
	}
	return result;
}

// || ROUTE HANDLERS

export async function searchFeatures(req, res) {
	const { lat, lon, radius } = req.query;
	const types = req.query.types?.split(",");

	// TODO error checking

	try {
		const bbox =
			gpsUtil.getBoundingBox(
				Number(lat),
				Number(lon),
				Number(radius)
			);
		const north = bbox[1].lat,
			east = bbox[1].lng,
			south = bbox[0].lat,
			west = bbox[0].lng;

		const query = `\
			[out:json][timeout:25][bbox:${south},${west},${north},${east}];${
			types.includes("trails") ? trailsQuery : ""}${
			types.includes("campgrounds") ? campgroundsQuery : ""}${
			types.includes("reserves") ? reservesQuery : ""}`;

		const { data } = await axios.post(overpassURL, query, {
			headers: { "content-type": "text/plain" },
			responseType: "json"
		});
		console.log(data);

		const result = [];

		for(const elem of data.elements) {
			const translatedData = translateOSMData(elem);
			if (elem.tags.leisure?.includes("nature_reserve")) {
				translatedData.category = "reserve";
			} else if (elem.tags.tourism?.includes("camp_site") || Object.hasOwn(elem.tags, "camp_site")) {
				translatedData.category = "campground";
			} else {
				translatedData.category = "trail";
			}
			result.push(translatedData);
		}

		res.send(result);
	} catch (error) {
		res.status(500).send(error);
	}
}

export function getSingleFeature(req, res) {
	const { osm_type, osm_id } = req.params;

	res.sendStatus(501);
}
