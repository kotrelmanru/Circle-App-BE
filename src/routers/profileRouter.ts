import { Router } from "express";
import * as profileController from "../controllers/profileController";
import authentication from "../middlewares/authentication";
import uploadMiddleware from "../middlewares/uploads";

const profileRouter = Router();

// Endpoint untuk memperbarui profil pengguna (dengan autentikasi dan upload gambar)
profileRouter.put(
  "/update",
  authentication,  // Pastikan pengguna sudah login
  uploadMiddleware, // Menggunakan multer untuk menangani upload file (gambar profil)
  profileController.updateProfile // Controller untuk memperbarui profil
);

export default profileRouter;
