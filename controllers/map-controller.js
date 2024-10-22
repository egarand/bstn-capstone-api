import axios from "axios";
import gpsUtil from "gps-util";

// || OVERPASS API QUERIES

const overpassURL = "https://overpass-api.de/api/interpreter";

const trailsQuery =
`(
	wr[!canoe][!portage][name][route~"hiking|bicycle"];
	wr[!canoe][!portage][name][highway~"footway|cycleway|path"][sac_scale~"hiking"];
);
out geom qt;`;

const reservesQuery =
`wr[leisure~nature_reserve];
out geom qt;`;

const campgroundsQuery =
`(
	wr[name][tourism~camp_site];
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

	if (result.tags.leisure?.includes("nature_reserve")) {
		result.category = "reserve";
	} else if (result.tags.tourism?.includes("camp_site") || Object.hasOwn(result.tags, "camp_site")) {
		result.category = "campground";
	} else {
		result.category = "trail";
	}

	return result;
}

// || ROUTE HANDLERS

export async function searchFeatures(req, res) {
	const { lat, lon, radius, types } = req.query;

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
			types.includes("r") ? reservesQuery : ""}${
			types.includes("c") ? campgroundsQuery : ""}${
			types.includes("t") ? trailsQuery : ""}`.replaceAll("\t", "");

		const { data } = await axios.post(overpassURL, query, {
			headers: { "content-type": "text/plain" },
			responseType: "json"
		});

		const result = [];
		for(const elem of data.elements) {
			result.push(translateOSMData(elem));
		}
		res.send(result);
	} catch (error) {
		res.status(500).send(error);
	}
}

export async function getSingleFeature(req, res) {
	const { osm_type, osm_id } = req.params;
	try {
		const query = `\
			[out:json][timeout:25];${
			osm_type}(${osm_id});${
			"out geom qt;"}`;
		const { data } = await axios.post(overpassURL, query, {
			headers: { "content-type": "text/plain" },
			responseType: "json"
		});
		const result = translateOSMData(data.elements[0]);
		res.send(result);
	} catch (error) {
		res.status(500).send(error);
	}
}
