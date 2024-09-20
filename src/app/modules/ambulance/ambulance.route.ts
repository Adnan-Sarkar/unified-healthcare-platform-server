import express from "express";
import { ambulanceController } from "./ambulance.controller";

const router = express.Router();

router.get("/ambulance-by-area", ambulanceController.getAllAmbulanceByArea);

router.get("/total-ambulance", ambulanceController.getTotalAmbulanceNumber);

router.post("/register-ambulance", ambulanceController.registerAmbulance);

router.patch("/:id", ambulanceController.updateAmbulanceInformation);

router.delete("/:id", ambulanceController.deleteAmbulanceInformation);

export const ambulanceRoutes = router;
