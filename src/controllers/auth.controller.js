import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSignUpForm = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "landing", "partials", "sign-up-form.html")
  );
};

export const signUp = (req, res) => {
  const data = req.body; 
  res.status(201).json({ message: "Sign-Up Successful!", data });
};

