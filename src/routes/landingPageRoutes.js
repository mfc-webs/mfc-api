import { viewHomePage } from "../controllers/landing/home/homePageController.js";
import { viewAboutPage } from "../controllers/landing/about/aboutPageController.js";

import express from "express";
import { getSessions } from "../controllers/admin/classSession.controller.js";

const router = express.Router();

router.get("/", viewHomePage);
router.get("/about", viewAboutPage);
router.get("/", getSessions);




export default router;