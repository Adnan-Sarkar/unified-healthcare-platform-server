import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { medicineService } from "./medicine.service";
import AppError from "../../error/AppError";

// add new medicine category
const addNewMedicineCategory = catchAsync(async (req, res) => {
  const result = await medicineService.addNewMedicineCategory(req.body);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to add new medicine category"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "New medicine category added successfull",
    data: null,
  });
});

// add new medicine
const addNewMedicine = catchAsync(async (req, res) => {
  const result = await medicineService.addNewMedicine(req.body);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to add new medicine");
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Added new medicine successfull",
    data: null,
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
  const { id } = req.params;
  const result = await medicineService.getSingleMedicineById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine information retrived successfully",
    data: result,
  });
});

// update medicine information
const updateMedicineInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await medicineService.updateMedicineInformation(req.body, id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to update medicine information"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine information updated successfully",
    data: null,
  });
});

// delete medicine information
const deleteMedicineInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await medicineService.deleteMedicineInformation(id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to delete medicine information"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine information deleted successfully",
    data: null,
  });
});

export const medicineController = {
  addNewMedicineCategory,
  addNewMedicine,
  getAllMedicines,
  getSingleMedicineById,
  updateMedicineInformation,
  deleteMedicineInformation,
};
