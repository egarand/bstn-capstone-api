import express from "express";
import * as userController from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/pois")
	.get(userController.getSavedPois)
	.post(userController.savePoi);

router.route("/pois/:id")
	.delete(userController.deletePoi);

router.route("/register")
	.get(userController.register);

router.route("/login")
	.get(userController.login);

export default router;
