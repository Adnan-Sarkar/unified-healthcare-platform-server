import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import AppError from "../../error/AppError";

// login
const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

// registration
const registration = catchAsync(async (req, res) => {
  const result = await authService.registration(req.body);

  if (result?.affectedRows !== 1) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong!");
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successfull",
    data: null,
  });
});

export const authController = {
  login,
  registration,
};
