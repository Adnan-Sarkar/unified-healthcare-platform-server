import express from "express";
import { patientController } from "./patient.controller";

const router = express.Router();

router.get("/", patientController.getAllPatients);

router.get("/:id", patientController.getSinglePatient);

router.post("/register-patient", patientController.registerPatient);

router.patch("/:id", patientController.updatePatientInformation);

export const patientRoutes = router;
