import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorService } from "./doctor.service";
import AppError from "../../error/AppError";

// register doctor
const registerDoctor = catchAsync(async (req, res) => {
  const result = await doctorService.registerDoctor(req.body);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to register doctor"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor registration successfull",
    data: null,
  });
});

// update doctor information
const updateDoctorInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorService.updateDoctorInformation(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor information updated successfully",
    data: result,
  });
});

export const doctorController = {
  registerDoctor,
  updateDoctorInformation,
};
