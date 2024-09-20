import express from "express";
import { donorController } from "./donor.controller";

const router = express.Router();

router.get("/:id", donorController.getAllDonationRequests);

router.post("/register-donor", donorController.registerDonor);

router.post("/send-message", donorController.sendMessage);

router.patch("/:id", donorController.updateDonorInformation);

router.patch("/donation-status/:id", donorController.updateDonationStatus);

export const bloodDonationRoutes = router;
