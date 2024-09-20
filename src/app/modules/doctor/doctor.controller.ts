import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorService } from "./doctor.service";

// register doctor
const registerDoctor = catchAsync(async (req, res) => {
  const result = await doctorService.registerDoctor();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor registration successfull",
    data: result,
  });
});

// update doctor information
const updateDoctorInformation = catchAsync(async (req, res) => {
  const result = await doctorService.updateDoctorInformation();

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
