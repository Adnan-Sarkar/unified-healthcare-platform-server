import { ResultSetHeader } from "mysql2";
import db from "../../database/db";
import { TUser } from "../../types";

// get user information
const getUserInformation = async () => {};

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
  const updateQuery = `UPDATE users SET ${fieldsToUpdate.join(
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
const changeUserStatus = async () => {};

// get user meta-data
const getUserMetadata = async () => {};

export const userService = {
  getUserInformation,
  updateUserInformation,
  changeUserStatus,
  getUserMetadata,
};
