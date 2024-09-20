import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../database/db";
import generateUniqueId from "../../utils/generateUniqueId";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config";

interface RegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  location: string;
  bloodGroup: string;
  dateOfBirth: string;
  Profilepicture: string;
}

interface LoginInput {
  email: string;
  password: string;
}

// login
const login = async (loginInfo: LoginInput) => {
  const { email, password } = loginInfo;

  // check user is exists or not
  const [rows]: [RowDataPacket[], any] = await db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );

  if (rows?.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const user = rows[0];

  // check password is correct or not
  const isPasswordValid = await bcrypt.compare(password, user?.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  // create token
  const token = jwt.sign(
    {
      id: user?.id,
      email: user?.email,
      accountStatus: user?.accountStatus,
      role: user?.role,
    },
    config.JWT_ACCESS_SECRET as string,
    {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    }
  );

  return token;
};

// registration user
const registration = async (registrationInfo: RegistrationInput) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    location,
    gender,
    dateOfBirth,
    bloodGroup,
    Profilepicture,
  } = registrationInfo;

  const role = "user";
  const accountStatus = "active";
  const id = generateUniqueId();

  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO users (id, firstName, lastName, email, password, gender, phone, location, dateOfBirth, role, accountStatus, bloodGroup, Profilepicture)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      firstName,
      lastName,
      email,
      password,
      gender,
      phone,
      location,
      dateOfBirth,
      role,
      accountStatus,
      bloodGroup,
      Profilepicture,
    ]
  );

  /**
     * {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 123, // Or the id you provided manually
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
      }   
     */
  return result;
};

export const authService = {
  login,
  registration,
};
