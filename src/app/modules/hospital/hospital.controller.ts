import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { hospitalService } from "./hospital.service";

// register hospital
const registerHospital = catchAsync(async (req, res) => {
  const result = await hospitalService.registerHospital();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Hospital registration successfull",
    data: result,
  });
});

// get hospitals by area
const getHospitalsByArea = catchAsync(async (req, res) => {
  const result = await hospitalService.getHospitalsByArea();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital list retrived successfully",
    data: result,
  });
});

// update hospital information
const updateHospitalInformation = catchAsync(async (req, res) => {
  const result = await hospitalService.updateHospitalInformation();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital information updated successfully",
    data: result,
  });
});

// delete hospital information
const deleteHospitalInformation = catchAsync(async (req, res) => {
  const result = await hospitalService.deleteHospitalInformation();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital information updated successfully",
    data: result,
  });
});

export const hospitalController = {
  registerHospital,
  getHospitalsByArea,
  updateHospitalInformation,
  deleteHospitalInformation,
};
