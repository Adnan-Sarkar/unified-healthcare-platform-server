import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { appointmentService } from "./appointment.service";
import AppError from "../../error/AppError";

// create new appointment
const createNewAppointment = catchAsync(async (req, res) => {
  const result = await appointmentService.createNewAppointment(
    req.body,
    req.user
  );

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Appointment registration failed!"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Appointment registration successfully",
    data: null,
  });
});

// get user's appointments
const getUserAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.getUserAppointments(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User appointments retrived successfully",
    data: result,
  });
});

// get doctor's appointments
const getDoctorAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.getDoctorAppointments(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor appointments retrived successfully",
    data: result,
  });
});

// update appointment
const updateAppointmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await appointmentService.updateAppointmentById(
    req.body,
    req.user,
    id
  );

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Appointment update failed!"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment updated successfully",
    data: null,
  });
});

// delete appointment
const deleteAppointmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await appointmentService.deleteAppointmentById(id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Appointment delete failed!"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment deleted successfully",
    data: null,
  });
});

// complete appointment
const completeAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await appointmentService.completeAppointment(id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Appointment complete failed!"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment completed successfully",
    data: null,
  });
});

// appointment statistics
const appointmentStatistics = catchAsync(async (_req, res) => {
  const result = await appointmentService.appointmentStatistics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total Appointments number retrived successfull",
    data: result,
  });
});

export const appointmentController = {
  createNewAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointmentById,
  deleteAppointmentById,
  completeAppointment,
  appointmentStatistics,
};
