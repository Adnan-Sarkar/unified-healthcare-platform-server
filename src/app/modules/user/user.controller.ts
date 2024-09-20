import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";
import AppError from "../../error/AppError";

// get user information
const getUserInformation = catchAsync(async (req, res) => {
  const result = await userService.getUserInformation();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User information retrived successfully",
    data: result,
  });
});

// update user information
const updateUserInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.updateUserInformation(req.body, id);

  if (result?.affectedRows !== 1) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong!");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User information updated successfully",
    data: null,
  });
});

// change user status
const changeUserStatus = catchAsync(async (req, res) => {
  const result = await userService.changeUserStatus();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status changed successfully",
    data: result,
  });
});

// get user meta-data
const getUserMetadata = catchAsync(async (req, res) => {
  const result = await userService.getUserMetadata();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User meta-data retrived successfully",
    data: result,
  });
});

export const userController = {
  getUserInformation,
  updateUserInformation,
  changeUserStatus,
  getUserMetadata,
};
