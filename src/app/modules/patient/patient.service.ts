import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { TJWTPayload, TPatient } from "../../types";
import db from "../../database/db";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import generateUniqueId from "../../utils/generateUniqueId";

type TPatientRegister = {
  patientData: Partial<TPatient>;
  patientDocuments?: string[];
};

// register patient
const registerPatient = async (
  patienInfo: TPatientRegister,
  user: TJWTPayload
) => {
  const { patientData, patientDocuments } = patienInfo;

  // check user is exist or not
  const [userExist]: [RowDataPacket[], any] = await db.query(
    `SELECT * FROM user WHERE id = ?`,
    [user.id]
  );

  if (userExist?.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    const patientId = generateUniqueId();
    // create new patient
    const [patientRegisterInfo]: [ResultSetHeader, any] =
      await connection.query(
        `INSERT INTO patient (id, userId, allergies, medicalHistory) VALUES (?, ?, ?, ?)`,
        [patientId, user.id, patientData.allergies, patientData.medicalHistory]
      );

    // create patient documents (if given)
    if (patientDocuments && patientDocuments?.length > 0) {
      for (const documentImage of patientDocuments) {
        await connection.query(
          `INSERT INTO patient_document (patientId, documentImage) VALUES (?, ?)`,
          [patientId, documentImage]
        );
      }
    }

    // commit the transaction
    await connection.commit();

    return patientRegisterInfo;
  } catch (error) {
    // rollback the transaction
    await connection.rollback();
    console.error("Transaction failed, rolling back:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Patient registration failed!"
    );
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

// get all patients
const getAllPatients = async () => {
  const [patients]: [RowDataPacket[], any] = await db.query(
    `SELECT
      user.id AS userId,
      user.firstName,
      user.lastName,
      user.email,
      user.gender,
      user.phone,
      user.location,
      user.dateOfBirth,
      user.role,
      user.accountStatus,
      patient.id AS patientId,
      patient.medicalHistory,
      patient.allergies,
      GROUP_CONCAT(patient_document.documentImage) AS documentImages
    FROM user
     INNER JOIN patient 
     ON user.id = patient.userId 
     LEFT JOIN patient_document 
     ON patient.id = patient_document.patientId
     GROUP BY user.id, patient.id;`
  );

  patients.forEach((patient) => {
    if (patient.documentImages) {
      patient.documentImages = patient.documentImages.split(",");
    } else {
      patient.documentImages = [];
    }
  });

  return patients;
};

// get single patient
const getSinglePatient = async (patientId: string) => {
  const [patients]: [RowDataPacket[], any] = await db.query(
    `SELECT
      patient.id AS patientId,
      patient.medicalHistory,
      patient.allergies,
      GROUP_CONCAT(patient_document.documentImage) AS documentImages
    FROM patient
    LEFT JOIN patient_document
    ON patient.id = patient_document.patientId
    WHERE patient.id = ?
    GROUP BY patient.id;
    `,
    [patientId]
  );

  const patientData = patients[0];

  // Convert documentImages string to an array
  if (patientData?.documentImages) {
    patientData.documentImages = patientData.documentImages.split(",");
  } else {
    patientData.documentImages = [];
  }

  return patientData;
};

// update patient information
const updatePatientInformation = async (
  updatedData: {
    patientData?: Partial<TPatient>;
    patientDocuments?: [
      {
        documentImageUrl: string;
        isRemove: boolean;
      }
    ];
  },
  patientId: string
) => {
  const { patientData, patientDocuments } = updatedData;

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];

  if (patientData?.allergies) {
    fieldsToUpdate.push("allergies = ?");
    valuesToUpdate.push(patientData.allergies);
  }

  if (patientData?.medicalHistory) {
    fieldsToUpdate.push("medicalHistory = ?");
    valuesToUpdate.push(patientData.medicalHistory);
  }

  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    // update patient information
    if (patientData) {
      const [result]: [ResultSetHeader, any] = await connection.query(
        `UPDATE patient SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
        [...valuesToUpdate, patientId]
      );

      if (result.affectedRows === 0) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Patient information update failed"
        );
      }
    }

    // update patient documents (if given)
    if (patientDocuments && patientDocuments?.length > 0) {
      for (const document of patientDocuments) {
        if (document.isRemove) {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `DELETE FROM patient_document WHERE documentImage = ? AND patientId = ?`,
            [document.documentImageUrl, patientId]
          );

          if (result.affectedRows === 0) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Patient document update failed"
            );
          }
        } else {
          const [result]: [ResultSetHeader, any] = await connection.query(
            `INSERT INTO patient_document (patientId, documentImage) VALUES (?, ?)`,
            [patientId, document.documentImageUrl]
          );

          if (result.affectedRows !== 1) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Patient document add failed"
            );
          }
        }
      }
    }

    // commit the transaction
    await connection.commit();

    return null;
  } catch (error) {
    // rollback the transaction
    await connection.rollback();
    console.error("Transaction failed, rolling back:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Update patient information failed!"
    );
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};

export const patientService = {
  registerPatient,
  getAllPatients,
  getSinglePatient,
  updatePatientInformation,
};
