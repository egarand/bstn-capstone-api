import express from "express";
import * as userController from "../controllers/user-controller.js";
import { speedLimiter } from "../middleware/rate-limiting.js";
import { verifyToken } from "../middleware/auth.js";
import * as validate from "../middleware/validation.js";

const router = express.Router();
router.use(speedLimiter);

router.route("/pois")
	.get(
		verifyToken,
		userController.getSavedPois
	)
	.post(
		verifyToken,
		...validate.userSavePoi,
		userController.savePoi
	);

router.route("/pois/:id")
	.delete(
		verifyToken,
		...validate.userDeletePoi,
		userController.deletePoi
	);

router.route("/register")
	.post(
		...validate.userRegister,
		userController.register
	);

router.route("/login")
	.post(userController.login);

export default router;
