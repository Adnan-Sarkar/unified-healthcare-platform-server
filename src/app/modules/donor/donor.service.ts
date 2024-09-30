import db from "../../database/db";
import { TDonationRequest, TDonor, TJWTPayload, TMessage } from "../../types";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import generateUniqueId from "../../utils/generateUniqueId";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import generateCurrentDateTime from "../../utils/generateCurrentDateTime";

// register donor
const registerDonor = async (donorInfo: Partial<TDonor>, user: TJWTPayload) => {
  const { lastDonationDate, isAvailable } = donorInfo;

  const newDonorId = generateUniqueId();

  // create donor
  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO donar (id, userId, lastDonationDate, isAvailable) VALUES (?, ?, ?, ?)`,
    [newDonorId, user.id, lastDonationDate, isAvailable]
  );

  return result;
};

// create donation request
const createDonationRequest = async (
  donationRequest: Partial<TDonationRequest>,
  user: TJWTPayload
) => {
  const { donorId, location, donationDateTime, emergencyContact } =
    donationRequest;

  const newDonationRequestId = generateUniqueId();
  const requestStatus = "pending";
  const isComplete = 0;

  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO blood_donation_request (id, donarId, requesterId, location, donationDateTime, emergencyContact, isComplete, requestStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newDonationRequestId,
      donorId,
      user.id,
      location,
      donationDateTime,
      emergencyContact,
      isComplete,
      requestStatus,
    ]
  );

  return result;
};

// get my donation requests
const getMyDonationRequests = async (
  user: TJWTPayload,
  query: { requestStatus: "approved" | "pending" | "rejected" } = {
    requestStatus: "pending",
  }
) => {
  const { id } = user;
  const { requestStatus } = query;

  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT * FROM blood_donation_request WHERE requesterId = ? AND requestStatus = ?`,
    [id, requestStatus]
  );

  return result;
};

// get my donation requests from requester
const getMyDonationRequestsFromRequester = async (
  donorId: string,
  query: { requestStatus: "approved" | "pending" | "rejected" } = {
    requestStatus: "pending",
  }
) => {
  const { requestStatus = "pending" } = query;

  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT * FROM blood_donation_request WHERE donarId = ? AND requestStatus = ?`,
    [donorId, requestStatus]
  );

  return result;
};

// update donation request
const updateDonationRequest = async (
  updateInfo: {
    requestStatus?: "approved" | "pending" | "rejected";
    isComplete?: boolean;
  },
  user: TJWTPayload,
  id: string
) => {
  const { requestStatus, isComplete } = updateInfo;

  // get donor id
  const [donor]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM donar WHERE userId = ?`,
    [user.id]
  );

  const donorId = donor[0]?.id;

  if (requestStatus) {
    const [result]: [ResultSetHeader, any] = await db.query(
      `UPDATE blood_donation_request SET requestStatus = ? WHERE id = ? AND donarId = ?`,
      [requestStatus, id, donorId]
    );

    if (result.affectedRows === 0) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Donation request status not updated"
      );
    }
  }

  if (isComplete === true || isComplete === false) {
    const isCompletedValue = isComplete ? 1 : 0;
    const [result]: [ResultSetHeader, any] = await db.query(
      `UPDATE blood_donation_request SET isComplete = ? WHERE id = ? AND donarId = ?`,
      [isCompletedValue, id, donorId]
    );

    if (result.affectedRows === 0) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Donation request completion status not updated"
      );
    }
  }

  return null;
};

// update donor information
const updateDonorInformation = async (
  donorInfo: Partial<TDonor>,
  id: string
) => {
  const { lastDonationDate, isAvailable } = donorInfo;

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];

  if (lastDonationDate) {
    fieldsToUpdate.push("lastDonationDate = ?");
    valuesToUpdate.push(lastDonationDate);
  }

  if (isAvailable === 0 || isAvailable === 1) {
    fieldsToUpdate.push("isAvailable = ?");
    valuesToUpdate.push(isAvailable);
  }

  const query = `UPDATE donar SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
  const [result]: [ResultSetHeader, any] = await db.query(query, [
    ...valuesToUpdate,
    id,
  ]);

  return result;
};

// message to donor-requester
const sendMessage = async (
  messageData: Omit<TMessage, "id" | "sendTime" | "senderId">,
  sender: TJWTPayload
) => {
  const { receiverId, content } = messageData;
  const newMessageId = generateUniqueId();

  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO messages (id, senderId, receiverId, content, sendTime) VALUES (?, ?, ?, ?, ?)`,
    [newMessageId, sender.id, receiverId, content, generateCurrentDateTime()]
  );

  return result;
};

// get messages
const getMessages = async (receiverId: string, user: TJWTPayload) => {
  const { id } = user;

  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT * FROM messages
     WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
     ORDER BY STR_TO_DATE(sendTime, '%m/%d/%Y %h:%i%p') ASC`,
    [id, receiverId, receiverId, id]
  );

  return result;
};

export const donorService = {
  registerDonor,
  createDonationRequest,
  getMyDonationRequests,
  getMyDonationRequestsFromRequester,
  updateDonationRequest,
  updateDonorInformation,
  sendMessage,
  getMessages,
};
