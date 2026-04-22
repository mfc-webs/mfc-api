import { viewHomePage } from "../controllers/landing/home/homePageController.js";
import { getSessions } from "../controllers/classSession.controller.js";

import express from "express";
import { requireGym } from "../middleware/gym.middleware.js";
import { registerGym, viewRegisterPage } from "../controllers/registration/registerGym.controller.js";


const router = express.Router();

router.get("/", requireGym, viewHomePage);
router.get("/", requireGym, getSessions);
router.get("/register-gym", viewRegisterPage)
router.post("/register", registerGym);




export default router;