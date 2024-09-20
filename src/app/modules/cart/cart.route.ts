import express from "express";
import { cartController } from "./cart.controller";

const router = express.Router();

router.post("/:id", cartController.getAllCartItems);

router.post("/add-to-cart", cartController.addItemToCart);

router.delete("/remove-to-cart", cartController.removeItemToCart);

export const cartRoutes = router;
