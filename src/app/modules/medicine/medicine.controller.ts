import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { medicineService } from "./medicine.service";

// add new medicine
const addNewMedicine = catchAsync(async (req, res) => {
  const result = await medicineService.addNewMedicine();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Added new medicine successfull",
    data: result,
  });
});

// get all medicines
const getAllMedicines = catchAsync(async (req, res) => {
  const result = await medicineService.getAllMedicines();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine list retrived successfully",
    data: result,
  });
});

// get single medicine by id
const getSingleMedicineById = catchAsync(async (req, res) => {
  const result = await medicineService.getSingleMedicineById();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine information retrived successfully",
    data: result,
  });
});

// update medicine information
const updateMedicineInformation = catchAsync(async (req, res) => {
  const result = await medicineService.updateMedicineInformation();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine information updated successfully",
    data: result,
  });
});

// delete medicine information
const deleteMedicineInformation = catchAsync(async (req, res) => {
  const result = await medicineService.deleteMedicineInformation();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine information deleted successfully",
    data: result,
  });
});

export const medicineController = {
  addNewMedicine,
  getAllMedicines,
  getSingleMedicineById,
  updateMedicineInformation,
  deleteMedicineInformation,
};
