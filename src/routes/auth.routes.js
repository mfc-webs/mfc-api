import { Router } from "express";
import { getSignUpForm, signUp } from "../controllers/auth.controller.js";

const router = Router();

router.get("/signup", getSignUpForm);  
router.post("/signup", signUp);        

export default router;
