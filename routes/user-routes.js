import express from "express";
import * as userController from "../controllers/user-controller.js";
import * as validate from "../middleware/validation.js";
import { speedLimiter } from "../middleware/rate-limiting.js";

const router = express.Router();
router.use(speedLimiter);

router.route("/pois")
	.get(userController.getSavedPois)
	.post(
		...validate.userSavePoi,
		userController.savePoi
	);

router.route("/pois/:id")
	.delete(
		...validate.userDeletePoi,
		userController.deletePoi
	);

router.route("/register")
	.post(userController.register);

router.route("/login")
	.post(userController.login);

export default router;
