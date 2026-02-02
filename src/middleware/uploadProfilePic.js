import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-pics");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const userId = req.user.sub;
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `user_${userId}_${Date.now()}${ext}`);
  },
});

export const uploadProfilePic = multer({ storage });
