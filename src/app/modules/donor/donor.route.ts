import express from "express";
import { donorController } from "./donor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/my-requests", auth("user"), donorController.getMyDonationRequests);

router.get(
  "/my-requests-from-requester/:id",
  auth("donor", "user"),
  donorController.getMyDonationRequestsFromRequester
);

router.post(
  "/register-donor",
  auth("user", "super_admin"),
  donorController.registerDonor
);

router.post(
  "/donation-request",
  auth("user"),
  donorController.createDonationRequest
);

router.post("/send-message", donorController.sendMessage);

router.patch(
  "/:id",
  auth("user", "donor"),
  donorController.updateDonorInformation
);

router.patch(
  "/donation-request/:id",
  auth("user", "donor"),
  donorController.updateDonationRequest
);

export const bloodDonationRoutes = router;
