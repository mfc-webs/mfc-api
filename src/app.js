import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import logger from "./middleware/logger.middleware.js";
import landingPageRoutes from "./routes/landingPageRoutes.js";


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();


// ----- middlewares ---- //

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

// ----- routes ---- //

app.get("", landingPageRoutes);
app.use("", authRoutes);


export default app;