import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const viewHomePage = async (req, res, next) => {

   res.sendFile(path.join(__dirname, "..", "..", "..", "views", "landing", "index.html"));

};

