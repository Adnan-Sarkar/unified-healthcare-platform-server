import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { cartService } from "./cart.service";

// add item to cart
const addItemToCart = catchAsync(async (req, res) => {
  const result = await cartService.addItemToCart();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Add medicine to cart successfull",
    data: result,
  });
});

// remove item to cart
const removeItemToCart = catchAsync(async (req, res) => {
  const result = await cartService.addItemToCart();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Remove medicine to cart successfull",
    data: result,
  });
});

// get all cart items
const getAllCartItems = catchAsync(async (req, res) => {
  const result = await cartService.addItemToCart();

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
