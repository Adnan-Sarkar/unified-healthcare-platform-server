import express from "express";
import { ambulanceController } from "./ambulance.controller";
import validateRequest from "../../middleware/validateRequest";
import { ambulanceValidationSchema } from "./ambulance.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", ambulanceController.getAllAmbulanceByArea);

router.get("/total-ambulance", ambulanceController.getTotalAmbulanceNumber);

router.post(
  "/register-ambulance",
  auth("admin", "super_admin"),
  validateRequest(ambulanceValidationSchema.registerAmbulanceSchema),
  ambulanceController.registerAmbulance
);

router.post(
  "/ambulance-category",
  auth("admin", "super_admin"),
  validateRequest(ambulanceValidationSchema.createAmbulanceCategorySchema),
  ambulanceController.createAmbulanceCategory
);

router.patch(
  "/:id",
  auth("admin", "super_admin"),
  validateRequest(ambulanceValidationSchema.updateAmbulanceSchema),
  ambulanceController.updateAmbulanceInformation
);

router.delete(
  "/:id",
  auth("admin", "super_admin"),
  ambulanceController.deleteAmbulanceInformation
);

export const ambulanceRoutes = router;
