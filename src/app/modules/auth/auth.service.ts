import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../database/db";
import generateUniqueId from "../../utils/generateUniqueId";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { PoolConnection } from "mysql2/promise";

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
  profilePicture: string;
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
    `SELECT * FROM user WHERE email = ?`,
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

  // get user roles
  const [roles]: [RowDataPacket[], any] = await db.query(
    `SELECT r.name
     FROM user_roles AS ur
    INNER JOIN roles AS r
    ON ur.roleId = r.id
    WHERE ur.userId = ?
    `,
    [user?.id]
  );

  const userRoles = roles?.map((row: any) => row?.name);

  // create token
  const token = jwt.sign(
    {
      id: user?.id,
      email: user?.email,
      accountStatus: user?.accountStatus,
      roles: userRoles,
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
    profilePicture,
  } = registrationInfo;

  const accountStatus = "active";
  const id = generateUniqueId();

  // hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.SALT_ROUNDS)
  );

  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    // create user
    const [result]: [ResultSetHeader, any] = await connection.query(
      `INSERT INTO user (id, firstName, lastName, email, password, gender, phone, location, dateOfBirth, accountStatus, bloodGroup, profilePicture)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        firstName,
        lastName,
        email,
        hashedPassword,
        gender,
        phone,
        location,
        dateOfBirth,
        accountStatus,
        bloodGroup,
        profilePicture,
      ]
    );

    // get user role id
    const [userRole]: [RowDataPacket[], any] = await connection.query(
      `SELECT id FROM roles WHERE name = ?`,
      ["user"]
    );

    const userRoleId = userRole[0]?.id;

    // create user role
    await connection.query(
      `INSERT INTO user_roles (userId, roleId) VALUES (?, ?)`,
      [id, userRoleId]
    );

    // commit the transaction
    await connection.commit();

    return result;
  } catch (error) {
    // rollback the transaction
    await connection.rollback();
    console.error("Transaction failed, rolling back:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "User registration failed!"
    );
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

export const authService = {
  login,
  registration,
};
