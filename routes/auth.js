import { Router } from "express";
import * as authController from "../controllers/authController.js";

const router = Router();
console.log("auth routes loaded");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

export default router;
