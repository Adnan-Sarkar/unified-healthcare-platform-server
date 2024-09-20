import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { patientService } from "./patient.service";

// register patient
const registerPatient = catchAsync(async (req, res) => {
  const result = await patientService.registerPatient();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Patient registration successfull",
    data: result,
  });
});

// get all patients
const getAllPatients = catchAsync(async (req, res) => {
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
  const result = await patientService.getSinglePatient();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient information retrived successfully",
    data: result,
  });
});

// update patient information
const updatePatientInformation = catchAsync(async (req, res) => {
  const result = await patientService.updatePatientInformation();

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
