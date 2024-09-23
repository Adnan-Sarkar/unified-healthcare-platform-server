import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../database/db";
import { TUser } from "../../types";

// get all users
const getAllUsers = async () => {
  const [rows]: [RowDataPacket[], any] = await db.query(
    "SELECT id, firstName, lastName, email, gender, phone, location, dateOfBirth, role, accountStatus, bloodGroup, profilePicture FROM user"
  );

  return rows;
};

// get user information
const getUserInformation = async (userId: string) => {
  const [rows]: [RowDataPacket[], any] = await db.query(
    "SELECT id, firstName, lastName, email, gender, phone, location, dateOfBirth, role, accountStatus, bloodGroup, profilePicture FROM user WHERE id = ?",
    [userId]
  );

  return rows[0];
};

// update user information
const updateUserInformation = async (
  updateUserInformation: Partial<TUser>,
  userId: string
) => {
  const { firstName, lastName, password, phone, location, profilePicture } =
    updateUserInformation;

  // Create an array to hold the fields to update
  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];

  if (firstName) {
    fieldsToUpdate.push("firstName = ?");
    valuesToUpdate.push(firstName);
  }

  if (lastName) {
    fieldsToUpdate.push("lastName = ?");
    valuesToUpdate.push(lastName);
  }

  if (password) {
    fieldsToUpdate.push("password = ?");
    valuesToUpdate.push(password);
  }

  if (phone) {
    fieldsToUpdate.push("phone = ?");
    valuesToUpdate.push(phone);
  }

  if (location) {
    fieldsToUpdate.push("location = ?");
    valuesToUpdate.push(location);
  }

  if (profilePicture) {
    fieldsToUpdate.push("profilePicture = ?");
    valuesToUpdate.push(profilePicture);
  }

  // Add userId to valuesToUpdate for the WHERE clause
  valuesToUpdate.push(userId);

  // Build the SQL query dynamically
  const updateQuery = `UPDATE user SET ${fieldsToUpdate.join(
    ", "
  )} WHERE id = ?`;

  // Execute the query
  const [result]: [ResultSetHeader, any] = await db.query(
    updateQuery,
    valuesToUpdate
  );

  return result;
};

/**
 * The rows output will be these possible types:
    RowDataPacket[]
    RowDataPacket[][]
    ResultSetHeader
    ResultSetHeader[]
    ProcedureCallPacket
 */

// change user status
const changeUserStatus = async (
  status: { accountStatus: string },
  userId: string
) => {
  const { accountStatus } = status;

  const [result]: [ResultSetHeader, any] = await db.query(
    "UPDATE user SET accountStatus = ? WHERE id = ?",
    [accountStatus, userId]
  );

  return result;
};

// get user meta-data
const getUserMetadata = async () => {};

export const userService = {
  getAllUsers,
  getUserInformation,
  updateUserInformation,
  changeUserStatus,
  getUserMetadata,
};
