import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ambulanceService } from "./ambulance.service";
import AppError from "../../error/AppError";

// create ambulance category
const createAmbulanceCategory = catchAsync(async (req, res) => {
  const result = await ambulanceService.createAmbulanceCategory(req.body);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ambulance category creation failed"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance category created successfully",
    data: null,
  });
});

// register ambulance
const registerAmbulance = catchAsync(async (req, res) => {
  const result = await ambulanceService.registerAmbulance(req.body);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ambulance registration failed");
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance registration successfull",
    data: null,
  });
});

// get all ambulance by area
const getAllAmbulanceByArea = catchAsync(async (req, res) => {
  const { area } = req.query;
  const result = await ambulanceService.getAllAmbulanceByArea(area as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ambulances by area retrived successfully",
    data: result,
  });
});

// update ambulance information
const updateAmbulanceInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ambulanceService.updateAmbulanceInformation(
    req.body,
    id
  );

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ambulance information update failed"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance information updated successfully",
    data: null,
  });
});

// delete ambulance information
const deleteAmbulanceInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ambulanceService.deleteAmbulanceInformation(id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ambulance information deletion failed"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance information deleted successfully",
    data: null,
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
  createAmbulanceCategory,
  registerAmbulance,
  getAllAmbulanceByArea,
  updateAmbulanceInformation,
  deleteAmbulanceInformation,
  getTotalAmbulanceNumber,
};
