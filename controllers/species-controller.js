import "dotenv/config";
import axios from "axios";

const inatBaseUrl = "https://api.inaturalist.org/v1/";

// courtesy to help inaturalist identify requests from this application
const userAgent = process.env.INAT_UA;

export async function searchByLocation(req, res) {
	const { north, east, south, west, taxa } = req.query;

	try {
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
			"User-Agent": userAgent
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
			"User-Agent": userAgent
		});

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
