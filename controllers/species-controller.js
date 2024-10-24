import "dotenv/config";
import axios from "axios";
import gpsUtil from "gps-util";

const inatBaseUrl = "https://api.inaturalist.org/v1/";

// courtesy to help source apis identify requests from this application
const userAgent = process.env.CUSTOM_UA;

export async function searchByLocation(req, res) {
	let { north, east, south, west, taxa } = req.query;

	try {
		// ensure bounding box is minimum 5 km across in both axes
		// helpful for PoIs with small bounding boxes
		let latDistance = gpsUtil.getDistance(east, north, west, north),
			lngDistance = gpsUtil.getDistance(east, north, east, south);
		if (latDistance < 5_000 || lngDistance < 5_000) {
			const mid = gpsUtil.getMidPoint([
				{lat: north, lng: east},
				{lat: south, lng: west}
			]);
			const minBbox = gpsUtil.getBoundingBox(mid.lat, mid.lng, 2_500);
			if (latDistance < 5_000) {
				south = minBbox[0].lat;
				north = minBbox[1].lat;
			}
			if (lngDistance < 5_000) {
				west = minBbox[0].lng;
				east = minBbox[1].lng;
			}
		}

		const url = new URL("observations/species_counts", inatBaseUrl);
		[
			["verifiable", true],
			["month", (new Date()).getMonth()],
			["iconic_taxa", taxa],
			["rank", "species"],
			["per_page", 100],
			["nelat", north],
			["nelng", east],
			["swlat", south],
			["swlng", west]
		].forEach(([k, v]) => url.searchParams.append(k, v));

		const { data } = await axios.get(url, {
			headers: {
				"User-Agent": userAgent,
				"Api-User-Agent": userAgent
			}
		});

		const species = data.results.map(({ taxon }) => ({
			id: taxon.id,
			common_name: taxon.preferred_common_name || taxon.english_common_name,
			photo: {
				square_url: taxon.default_photo.square_url,
				attribution: taxon.default_photo.attribution
			}
		}));
		res.send({
			total: Math.min(data.total_results, 100),
			species
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
}

export async function getSingleSpecies(req, res) {
	const { id } = req.params;
	try {
		const inatUrl = new URL(`taxa/${id}`, inatBaseUrl);
		const { data: { results: [taxon] } } = await axios.get(inatUrl, {
			headers: {
				"User-Agent": userAgent,
				"Api-User-Agent": userAgent
			}
		});

		const wikiUrl = new URL(
			taxon.wikipedia_url.split("/").pop(),
			"https://en.wikipedia.org/api/rest_v1/page/summary/"
		);
		const { data: { extract_html }} = await axios.get(wikiUrl, {
			headers: {
				"User-Agent": userAgent,
				"Api-User-Agent": userAgent
			}
		});

		const result = {
			id: taxon.id,
			common_name: taxon.preferred_common_name || taxon.english_common_name,
			scientific_name: taxon.name,
			photo: {
				square_url: taxon.default_photo.square_url,
				medium_url: taxon.default_photo.square_url.replace("square", "medium"),
				attribution: taxon.default_photo.attribution
			},
			wikipedia_url: taxon.wikipedia_url,
			wikipedia_excerpt: extract_html
		};
		res.send(result);
	} catch (error) {
		res.status(500).send(error);
	}
}
