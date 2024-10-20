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

		const resData = results.map(({ taxon }) => ({
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

export async function getSingleSpecies(req, res) {
	const { id } = req.params;
	try {
		const inatUrl = new URL(`taxa/${id}`, inatBaseUrl);
		const { data: { results: [taxon] } } = await axios.get(inatUrl);

		const wikiUrl = new URL(
			taxon.wikipedia_url.split("/").pop(),
			"https://en.wikipedia.org/api/rest_v1/page/summary/"
		);
		const { data: { extract_html }} = await axios.get(wikiUrl);

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
