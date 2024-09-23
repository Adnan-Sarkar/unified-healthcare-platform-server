import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { patientService } from "./patient.service";
import AppError from "../../error/AppError";

// register patient
const registerPatient = catchAsync(async (req, res) => {
  const result = await patientService.registerPatient(req.body, req.user);

  if (result.affectedRows !== 1) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Patient registration failed"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient registration successfull",
    data: null,
  });
});

// get all patients
const getAllPatients = catchAsync(async (_req, res) => {
  const result = await patientService.getAllPatients();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient list retrived successfully",
    data: result,
  });
});

// get single patient
const getSinglePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientService.getSinglePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient information retrived successfully",
    data: result,
  });
});

// update patient information
const updatePatientInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientService.updatePatientInformation(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient information updated successfully",
    data: result,
  });
});

export const patientController = {
  registerPatient,
  getAllPatients,
  getSinglePatient,
  updatePatientInformation,
};
