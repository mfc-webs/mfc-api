import { viewHomePage } from "../controllers/landing/home/homePageController.js";
import { getSessions } from "../controllers/classSession.controller.js";

import express from "express";
import { requireGym } from "../middleware/gym.middleware.js";


const router = express.Router();

router.get("/", viewHomePage);
router.get("/", getSessions);




export default router;