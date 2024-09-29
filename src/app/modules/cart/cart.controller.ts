import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { cartService } from "./cart.service";
import AppError from "../../error/AppError";

// add item to cart
const addItemToCart = catchAsync(async (req, res) => {
  const result = await cartService.addItemToCart(req.body, req.user);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to add item to cart");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Add item to cart successfully",
    data: null,
  });
});

// remove item to cart
const removeItemToCart = catchAsync(async (req, res) => {
  const result = await cartService.removeItemToCart();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Remove medicine to cart successfull",
    data: result,
  });
});

// get all cart items
const getAllCartItems = catchAsync(async (req, res) => {
  const result = await cartService.getAllCartItems();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived all cart items successfully",
    data: result,
  });
});

export const cartController = {
  addItemToCart,
  removeItemToCart,
  getAllCartItems,
};
