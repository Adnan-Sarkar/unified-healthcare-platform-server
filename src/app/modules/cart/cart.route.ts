import express from "express";
import { cartController } from "./cart.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { cartValidationSchema } from "./cart.validation";

const router = express.Router();

router.post("/:id", cartController.getAllCartItems);

router.post(
  "/add-to-cart",
  auth("user"),
  validateRequest(cartValidationSchema.addItemToCartValidationSchema),
  cartController.addItemToCart
);

router.delete("/remove-to-cart", auth("user"), cartController.removeItemToCart);

export const cartRoutes = router;
