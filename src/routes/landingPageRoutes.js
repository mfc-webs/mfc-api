import { viewHomePage } from "../controllers/landing/home/homePageController.js";
import { getSessions } from "../controllers/classSession.controller.js";

import express from "express";
import { requireGym } from "../middleware/gym.middleware.js";


const router = express.Router();

router.get("/",requireGym, viewHomePage);
router.get("/", requireGym, getSessions);




export default router;