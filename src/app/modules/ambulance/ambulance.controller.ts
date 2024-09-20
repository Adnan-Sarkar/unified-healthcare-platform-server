import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ambulanceService } from "./ambulance.service";

// register ambulance
const registerAmbulance = catchAsync(async (req, res) => {
  const result = await ambulanceService.registerAmbulance();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance registration successfull",
    data: result,
  });
});

// get all ambulance by area
const getAllAmbulanceByArea = catchAsync(async (req, res) => {
  const result = await ambulanceService.getAllAmbulanceByArea();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulances by area retrived successfully",
    data: result,
  });
});

// update ambulance information
const updateAmbulanceInformation = catchAsync(async (req, res) => {
  const result = await ambulanceService.updateAmbulanceInformation();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance information updated successfully",
    data: result,
  });
});

// delete ambulance information
const deleteAmbulanceInformation = catchAsync(async (req, res) => {
  const result = await ambulanceService.deleteAmbulanceInformation();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance information deleted successfully",
    data: result,
  });
});

// get total ambulance number
const getTotalAmbulanceNumber = catchAsync(async (req, res) => {
  const result = await ambulanceService.getTotalAmbulanceNumber();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Total number of ambulances retrived successfully",
    data: result,
  });
});

export const ambulanceController = {
  registerAmbulance,
  getAllAmbulanceByArea,
  updateAmbulanceInformation,
  deleteAmbulanceInformation,
  getTotalAmbulanceNumber,
};
