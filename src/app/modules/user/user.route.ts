import express from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidationSchema } from "./user.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth("admin", "super_admin"), userController.getAllUsers);

router.get("/:id", userController.getUserInformation);

router.get("/meta-data/:id", userController.getUserMetadata);

router.patch(
  "/:id",
  validateRequest(userValidationSchema.updateUserSchema),
  userController.updateUserInformation
);

router.patch(
  "/change-status/:id",
  auth("super_admin", "admin"),
  userController.changeUserStatus
);

export const userRoutes = router;
