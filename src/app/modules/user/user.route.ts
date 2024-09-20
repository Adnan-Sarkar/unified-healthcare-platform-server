import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidationSchema } from "./user.validation";

const router = express.Router();

router.get("/:id", userController.getUserInformation);

router.get("/meta-data/:id", userController.getUserMetadata);

router.patch(
  "/:id",
  validateRequest(userValidationSchema.updateUserSchema),
  userController.updateUserInformation
);

router.patch("/change-status/:id", userController.changeUserStatus);

export const userRoutes = router;
