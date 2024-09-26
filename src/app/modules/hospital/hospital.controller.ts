import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { hospitalService } from "./hospital.service";
import AppError from "../../error/AppError";

// register hospital
const registerHospital = catchAsync(async (req, res) => {
  const result = await hospitalService.registerHospital(req.body);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to register hospital");
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Hospital registration successfull",
    data: null,
  });
});

// get hospitals by area
const getHospitalsByArea = catchAsync(async (req, res) => {
  const result = await hospitalService.getHospitalsByArea(
    req.query as { area: string }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital list retrived successfully",
    data: result,
  });
});

// update hospital information
const updateHospitalInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await hospitalService.updateHospitalInformation(req.body, id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to update hospital information"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital information updated successfully",
    data: null,
  });
});

// delete hospital information
const deleteHospitalInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await hospitalService.deleteHospitalInformation(id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to delete hospital information"
    );
  }

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
