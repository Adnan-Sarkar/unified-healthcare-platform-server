import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { appointmentService } from "./appointment.service";

// create new appointment
const createNewAppointment = catchAsync(async (req, res) => {
  const result = await appointmentService.createNewAppointment();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Create new appointment successfull",
    data: result,
  });
});

// get user's appointment
const getUserAppointmentById = catchAsync(async (req, res) => {
  const result = await appointmentService.getUserAppointmentById();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User appointment retrived successfull",
    data: result,
  });
});

// get doctor's appointment
const getDoctorAppointmentById = catchAsync(async (req, res) => {
  const result = await appointmentService.getDoctorAppointmentById();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor appointment retrived successfull",
    data: result,
  });
});

// update appointment
const updateAppointmentById = catchAsync(async (req, res) => {
  const result = await appointmentService.updateAppointmentById();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment updated successfull",
    data: result,
  });
});

// delete appointment
const deleteAppointmentById = catchAsync(async (req, res) => {
  const result = await appointmentService.deleteAppointmentById();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment deleted successfull",
    data: result,
  });
});

// count total appointments (complete  + rejected)
const countTotalAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.deleteAppointmentById();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total Appointments number retrived successfull",
    data: result,
  });
});

export const appointmentController = {
  createNewAppointment,
  getUserAppointmentById,
  getDoctorAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
  countTotalAppointments,
};
