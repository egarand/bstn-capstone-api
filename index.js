import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";

import mapRoutes from "./routes/map-routes.js";
import speciesRoutes from "./routes/species-routes.js";
import userRoutes from "./routes/user-routes.js";

const PORT = process.env.PORT || 5051;
const { CORS_ORIGIN } = process.env;
const app = express();

// global middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(compression());

// routes
app.use("/pois", mapRoutes);
app.use("/life", speciesRoutes);
app.use("/users", userRoutes);

// start server
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
