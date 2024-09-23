import express from "express";
import { patientController } from "./patient.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { patientValidationSchema } from "./patient.validation";

const router = express.Router();

router.get("/", auth("admin", "super_admin"), patientController.getAllPatients);

router.get(
  "/:id",
  auth("admin", "doctor", "patient", "super_admin", "user"),
  patientController.getSinglePatient
);

router.post(
  "/register-patient",
  auth("user"),
  validateRequest(patientValidationSchema.registerPatientSchema),
  patientController.registerPatient
);

router.patch(
  "/:id",
  auth("patient", "user", "super_admin"),
  validateRequest(patientValidationSchema.updatePatientSchema),
  patientController.updatePatientInformation
);

export const patientRoutes = router;
