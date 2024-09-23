import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TDoctor, TUser } from "../../types";
import db from "../../database/db";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import generateUniqueId from "../../utils/generateUniqueId";
import { PoolConnection } from "mysql2/promise";
import bcrypt from "bcrypt";
import { config } from "../../config";

type TDoctorUpdateInfo = {
  doctorInfo?: Partial<TDoctor>;
  doctorQualification?: [
    {
      qualification: string;
      isRemove: boolean;
    }
  ];
  doctorSpecialization?: [
    {
      specializationId: string;
      isRemove: boolean;
    }
  ];
  doctorDayTime?: [
    {
      dayTimeId: string;
      isRemove: boolean;
    }
  ];
};

// register doctor
const registerDoctor = async (doctorRegisterInfo: {
  userInfo: Partial<TUser>;
  doctorInfo: Partial<TDoctor>;
}) => {
  const { userInfo, doctorInfo } = doctorRegisterInfo;
  const {
    firstName,
    lastName,
    email,
    password,
    bloodGroup,
    gender,
    phone,
    dateOfBirth,
    location,
    profilePicture,
  } = userInfo;
  const { doctorBio, professionStartDate, consultationFee } = doctorInfo;

  const role = "doctor";
  const accountStatus = "active";
  const newUserId = generateUniqueId();
  const doctorId = generateUniqueId();

  // hash password
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(config.SALT_ROUNDS)
  );

  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    // create new user
    const [userResult]: [ResultSetHeader, any] = await connection.query(
      `INSERT INTO user (id, firstName, lastName, email, password, gender, phone, location, dateOfBirth, role, accountStatus, bloodGroup, Profilepicture)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUserId,
        firstName,
        lastName,
        email,
        hashedPassword,
        gender,
        phone,
        location,
        dateOfBirth,
        role,
        accountStatus,
        bloodGroup,
        profilePicture,
      ]
    );

    if (userResult.affectedRows === 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create user"
      );
    }

    // get user id
    const [newUserData]: [RowDataPacket[], any] = await connection.query(
      `SELECT * FROM user WHERE email = ?`,
      [email]
    );

    const userId = newUserData[0]?.id;

    // create new doctor
    const [result]: [ResultSetHeader, any] = await connection.query(
      `INSERT INTO doctor (id, userId, doctorBio, professionStartDate, consultationFee) VALUES (?, ?, ?, ?, ?)`,
      [doctorId, userId, doctorBio, professionStartDate, consultationFee]
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
      "Doctor registration failed!"
    );
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

// update doctor information
const updateDoctorInformation = async (
  updateInformation: TDoctorUpdateInfo,
  doctorId: string
) => {
  const {
    doctorInfo,
    doctorQualification,
    doctorSpecialization,
    doctorDayTime,
  } = updateInformation;

  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    const fieldsToUpdate: string[] = [];
    const valuesToUpdate: any[] = [];

    // update doctor information (if given)
    if (doctorInfo) {
      const { doctorBio, professionStartDate, consultationFee } = doctorInfo;

      if (doctorBio) {
        fieldsToUpdate.push("doctorBio = ?");
        valuesToUpdate.push(doctorBio);
      }

      if (professionStartDate) {
        fieldsToUpdate.push("professionStartDate = ?");
        valuesToUpdate.push(professionStartDate);
      }

      if (consultationFee) {
        fieldsToUpdate.push("consultationFee = ?");
        valuesToUpdate.push(consultationFee);
      }

      const query = `UPDATE doctor SET ${fieldsToUpdate.join(
        ", "
      )} WHERE id = ?`;

      const [result]: [ResultSetHeader, any] = await connection.query(query, [
        ...valuesToUpdate,
        doctorId,
      ]);

      if (result.affectedRows === 0) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Failed to update doctor information"
        );
      }
    }

    // update doctor qualification (if given)
    if (doctorQualification && doctorQualification?.length > 0) {
      for (const qualification of doctorQualification) {
        if (qualification?.isRemove) {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `DELETE FROM doctor_qualification WHERE qualifications = ? AND doctorId = ?`,
            [qualification.qualification, doctorId]
          );

          if (result.affectedRows === 0) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Failed to remove doctor qualification"
            );
          }
        } else {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `INSERT INTO doctor_qualification (doctorId, qualifications) VALUES (?, ?)`,
            [doctorId, qualification.qualification]
          );

          if (result.affectedRows !== 1) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Failed to add doctor qualification"
            );
          }
        }
      }
    }

    // update doctor specialization (if given)
    if (doctorSpecialization && doctorSpecialization?.length > 0) {
      for (const specialization of doctorSpecialization) {
        if (specialization?.isRemove) {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `DELETE FROM doctor_specialization WHERE specializationId = ? AND doctorId = ?`,
            [specialization.specializationId, doctorId]
          );

          if (result.affectedRows === 0) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Failed to remove doctor specialization"
            );
          }
        } else {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `INSERT INTO doctor_specialization (doctorId, specializationId) VALUES (?, ?)`,
            [doctorId, specialization.specializationId]
          );

          if (result.affectedRows !== 1) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Failed to add doctor specialization"
            );
          }
        }
      }
    }

    // update doctor day time (if given)
    if (doctorDayTime && doctorDayTime?.length > 0) {
      for (const dayTime of doctorDayTime) {
        if (dayTime?.isRemove) {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `DELETE FROM doctor_day_time WHERE dayTimeId = ? AND doctorId = ?`,
            [dayTime.dayTimeId, doctorId]
          );

          if (result.affectedRows === 0) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Failed to remove doctor day time"
            );
          }
        } else {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `INSERT INTO doctor_day_time (doctorId, dayTimeId) VALUES (?, ?)`,
            [doctorId, dayTime.dayTimeId]
          );

          if (result.affectedRows !== 1) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Failed to add doctor day time"
            );
          }
        }
      }
    }

    // commit the transaction
    await connection.commit();
  } catch (error) {
    // rollback the transaction
    await connection.rollback();
    console.error("Transaction failed, rolling back:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Doctor information update failed!"
    );
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

export const doctorService = {
  registerDoctor,
  updateDoctorInformation,
};
