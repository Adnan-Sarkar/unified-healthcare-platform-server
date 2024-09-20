import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { donorService } from "./donor.service";

// register donor
const registerDonor = catchAsync(async (req, res) => {
  const result = await donorService.registerDonor();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Donor registration successfull",
    data: result,
  });
});

// get all donation requests
const getAllDonationRequests = catchAsync(async (req, res) => {
  const result = await donorService.getAllDonationRequests();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor requests retrived successfully",
    data: result,
  });
});

// update donation status
const updateDonationStatus = catchAsync(async (req, res) => {
  const result = await donorService.updateDonationStatus();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request status updated successfully",
    data: result,
  });
});

// update donor information
const updateDonorInformation = catchAsync(async (req, res) => {
  const result = await donorService.updateDonationStatus();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor information updated successfully",
    data: result,
  });
});

// message to donor-requester
const sendMessage = catchAsync(async (req, res) => {
  const result = await donorService.updateDonationStatus();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor information updated successfully",
    data: result,
  });
});

export const donorController = {
  registerDonor,
  getAllDonationRequests,
  updateDonationStatus,
  updateDonorInformation,
  sendMessage,
};
