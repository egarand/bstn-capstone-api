import jwt from "jsonwebtoken";
import "dotenv/config";

export function verifyToken(req, res, next) {
	req.user = { id: null, verified: false };

	const bearerHeader = req.headers["authorization"];

	if (typeof bearerHeader === "undefined") {
		return res.sendStatus(403);
	}

	const bearerToken = bearerHeader.split(" ")[1];
	jwt.verify(bearerToken, process.env.PRIVATE_KEY, (err, data) => {
		if(! (err && typeof data === "undefined")) {
			req.user = { id: data.id, verified: true };
			next();
		}
	})
	if (!req.user.verified) {
		return res.sendStatus(403);
	}
}
