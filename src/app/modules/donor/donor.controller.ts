import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { donorService } from "./donor.service";
import AppError from "../../error/AppError";

// register donor
const registerDonor = catchAsync(async (req, res) => {
  const result = await donorService.registerDonor(req.body, req.user);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Donor registration failed");
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Donor registration successfull",
    data: null,
  });
});

// create donation request
const createDonationRequest = catchAsync(async (req, res) => {
  const result = await donorService.createDonationRequest(req.body, req.user);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Donation request creation failed"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request created successfully",
    data: null,
  });
});

// get my donation requests
const getMyDonationRequests = catchAsync(async (req, res) => {
  const query = req.query as {
    requestStatus: "pending" | "approved" | "rejected";
  };
  const result = await donorService.getMyDonationRequests(req.user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation requests retrived successfully",
    data: result,
  });
});

// get my donation requests from requester
const getMyDonationRequestsFromRequester = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = req.query as {
    requestStatus: "pending" | "approved" | "rejected";
  };

  const result = await donorService.getMyDonationRequestsFromRequester(
    id,
    query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request from requesters retrived successfully",
    data: result,
  });
});

// update donation request
const updateDonationRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await donorService.updateDonationRequest(
    req.body,
    req.user,
    id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request status updated successfully",
    data: result,
  });
});

// update donor information
const updateDonorInformation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await donorService.updateDonorInformation(req.body, id);

  if (result.affectedRows === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Donor information update failed"
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor information updated successfully",
    data: result,
  });
});

// message to donor-requester
const sendMessage = catchAsync(async (req, res) => {
  const result = await donorService.sendMessage(req.body, req.user);

  if (result.affectedRows === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Donor message sending failed");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor message sent successfully",
    data: null,
  });
});

// get messages
const getMessages = catchAsync(async (req, res) => {
  const result = await donorService.getMessages(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived messages successfully",
    data: result,
  });
});

export const donorController = {
  registerDonor,
  createDonationRequest,
  getMyDonationRequests,
  getMyDonationRequestsFromRequester,
  updateDonationRequest,
  updateDonorInformation,
  sendMessage,
  getMessages,
};
