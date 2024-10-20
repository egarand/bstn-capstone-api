import axios from "axios";

const inatBaseUrl = "https://api.inaturalist.org/v1/";

export async function searchByLocation(req, res) {
	const { lat, lon, taxa } = req.query;
	try {
		const url = new URL("observations/species_counts", inatBaseUrl);
		[
			["verifiable", true],
			["month", (new Date()).getMonth()],
			["iconic_taxa", taxa],
			["rank", "species"],
			["per_page", 30],
			["lat", lat],
			["lng", lon],
			["radius", 5] //km
		].forEach(([k, v]) => url.searchParams.append(k, v));

		const { data: { results }} = await axios.get(url);

		const resData = results.map((taxon) => ({
			id: taxon.id,
			common_name: taxon.preferred_common_name || taxon.english_common_name,
			photo: {
				square_url: taxon.default_photo.square_url,
				attribution: taxon.default_photo.attribution
			}
		}));
		res.send(resData);
	} catch (error) {
		res.status(500).send(error);
	}
}

export function getSingleSpecies(req, res) {
	const { osm_type, osm_id } = req.params;

	res.sendStatus(501);
}
