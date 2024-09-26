import express from "express";
import { hospitalController } from "./hospital.controller";
import validateRequest from "../../middleware/validateRequest";
import { hospitalValidationSchema } from "./hospital.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router.get(
  "/",
  auth("admin", "super_admin", "doctor", "donor", "user", "patient"),
  hospitalController.getHospitalsByArea
);

router.post(
  "/register-hospital",
  auth("admin", "super_admin"),
  validateRequest(hospitalValidationSchema.registerHospitalSchema),
  hospitalController.registerHospital
);

router.patch(
  "/:id",
  auth("admin", "super_admin"),
  validateRequest(hospitalValidationSchema.updateHospitalSchema),
  hospitalController.updateHospitalInformation
);

router.delete(
  "/:id",
  auth("admin", "super_admin"),
  hospitalController.deleteHospitalInformation
);

export const hospitalRoutes = router;
