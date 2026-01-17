import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import jwt from "jsonwebtoken";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import logger from "./middleware/logger.middleware.js";
import landingPageRoutes from "./routes/landingPageRoutes.js";
import dashboardPageRoutes from "./routes/dashboardPageRoutes.js";
import membersRoutes from "./routes/members.routes.js";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// database

await connectDB();

// ----- middlewares ---- //
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve /assets
app.use("/assets", express.static(path.join(__dirname, "views", "assets")));


// ----- routes ---- //


app.use(authRoutes);
app.use(landingPageRoutes);
app.use(dashboardPageRoutes);
app.use(membersRoutes);



// 404 fallback 
app.use((req, res) => res.status(404).send("404 Not Found"));

export default app;