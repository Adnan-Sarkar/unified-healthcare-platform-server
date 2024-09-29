import express from "express";
import { cartController } from "./cart.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { cartValidationSchema } from "./cart.validation";

const router = express.Router();

router.get("/", auth("user"), cartController.getCartItems);

router.post(
  "/add-to-cart",
  auth("user"),
  validateRequest(cartValidationSchema.addItemToCartValidationSchema),
  cartController.addItemToCart
);

router.patch(
  "/remove-from-cart",
  auth("user"),
  validateRequest(cartValidationSchema.removeItemToCartValidationSchema),
  cartController.removeItemToCart
);

export const cartRoutes = router;
