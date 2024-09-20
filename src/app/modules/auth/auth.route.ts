import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { authValidationSchema } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidationSchema.loginUserSchema),
  authController.login
);

router.post(
  "/registration",
  validateRequest(authValidationSchema.registerUserSchema),
  authController.registration
);

export const authRoutes = router;
