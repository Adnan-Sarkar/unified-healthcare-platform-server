import express from "express";
import { donorController } from "./donor.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { bloodDonationValidationSchema } from "./donor.validation";

const router = express.Router();

router.get("/my-requests", auth("user"), donorController.getMyDonationRequests);

router.get(
  "/my-requests-from-requester/:id",
  auth("donor", "user"),
  donorController.getMyDonationRequestsFromRequester
);

router.get("/messages", auth("user", "donor"), donorController.getMessages);

router.post(
  "/register-donor",
  auth("user", "super_admin"),
  validateRequest(bloodDonationValidationSchema.registerDonorSchema),
  donorController.registerDonor
);

router.post(
  "/donation-request",
  auth("user"),
  validateRequest(bloodDonationValidationSchema.createDonationRequestSchema),
  donorController.createDonationRequest
);

router.post(
  "/send-message",
  auth("user", "donor"),
  validateRequest(bloodDonationValidationSchema.sendMessageSchema),
  donorController.sendMessage
);

router.patch(
  "/:id",
  auth("user", "donor"),
  validateRequest(bloodDonationValidationSchema.updateDonorInformationSchema),
  donorController.updateDonorInformation
);

router.patch(
  "/donation-request/:id",
  auth("user", "donor"),
  validateRequest(bloodDonationValidationSchema.updateDonationRequestSchema),
  donorController.updateDonationRequest
);

export const bloodDonationRoutes = router;
