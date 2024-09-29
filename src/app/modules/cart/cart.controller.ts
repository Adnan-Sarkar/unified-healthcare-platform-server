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

// get cart items
const getCartItems = catchAsync(async (req, res) => {
  const result = await cartService.getCartItems(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived cart items successfully",
    data: result,
  });
});

// remove item to cart
const removeItemToCart = catchAsync(async (req, res) => {
  const result = await cartService.removeItemToCart(req.body, req.user);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to remove item to cart");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Remove item to cart successfull",
    data: null,
  });
});

// create order
const createOrder = catchAsync(async (req, res) => {
  const result = await cartService.createOrder(req.user);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create order");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

export const cartController = {
  addItemToCart,
  removeItemToCart,
  getCartItems,
  createOrder,
};
