import express from "express";
import { doctorController } from "./doctor.controller";

const router = express.Router();

router.post("/register-doctor", doctorController.registerDoctor);

router.patch("/:id", doctorController.updateDoctorInformation);

export const doctorRoutes = router;
