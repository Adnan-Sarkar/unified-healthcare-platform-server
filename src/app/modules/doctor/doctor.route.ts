import express from "express";
import { doctorController } from "./doctor.controller";
import auth from "../../middleware/auth";
import { doctorValidationSchema } from "./doctor.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.post(
  "/register-doctor",
  auth("admin", "super_admin", "user"),
  validateRequest(doctorValidationSchema.registerDoctorSchema),
  doctorController.registerDoctor
);

router.patch(
  "/:id",
  auth("user", "doctor"),
  validateRequest(doctorValidationSchema.doctorUpdateSchema),
  doctorController.updateDoctorInformation
);

export const doctorRoutes = router;
