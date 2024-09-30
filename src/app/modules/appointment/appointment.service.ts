import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../database/db";
import generateUniqueId from "../../utils/generateUniqueId";
import { TJWTPayload } from "../../types";

// create new appointment
const createNewAppointment = async (
  payload: {
    doctorId: string;
    day: string;
    date: string;
    timeSlot: string;
    note?: string;
  },
  user: JwtPayload
) => {
  const { doctorId, day, date, timeSlot, note } = payload;
  const { userId } = user;

  // patient id
  const [patient]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM patient WHERE userId = ?`,
    [userId]
  );

  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient not found!");
  }

  const patientId = patient[0].id;
  const appointmentId = generateUniqueId();

  // create new appointment
  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO appointment (id, patientId, doctorId, paymentStatus, day, date, timeSlot, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [appointmentId, patientId, doctorId, 1, day, date, timeSlot, note]
  );

  return result;
};

// get user's appointments
const getUserAppointments = async (user: TJWTPayload) => {
  const { id } = user;

  // get patient id
  const [patient]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM patient WHERE userId = ?`,
    [id]
  );

  if (!patient || patient.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient not found!");
  }

  const patientId = patient[0].id;

  // get appointments
  const [appointments]: [RowDataPacket[], any] = await db.query(
    `SELECT
      a.*,
      u.firstName AS doctorFirstName,
      u.lastName AS doctorLastName,
      u.profilePicture AS doctorProfilePicture
     FROM appointment a
     INNER JOIN doctor d
      ON a.doctorId = d.id
     INNER JOIN user u
      ON d.userId = u.id
     WHERE a.patientId = ?`,
    [patientId]
  );

  return appointments;
};

// get doctor's appointments
const getDoctorAppointments = async (user: TJWTPayload) => {
  const { id } = user;

  // get doctor id
  const [doctor]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM doctor WHERE userId = ?`,
    [id]
  );

  if (!doctor || doctor.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found!");
  }

  const doctorId = doctor[0].id;

  // get appointments
  const [appointments]: [RowDataPacket[], any] = await db.query(
    `SELECT 
      a.*,
      u.firstName AS patientFirstName,
      u.lastName AS patientLastName,
      u.profilePicture AS patientProfilePicture 
    FROM appointment a
    INNER JOIN patient p
      ON a.patientId = p.id
    INNER JOIN user u
      ON p.userId = u.id
    WHERE a.doctorId = ?`,
    [doctorId]
  );

  return appointments;
};

// update appointment
const updateAppointmentById = async (
  payload: {
    appointmentStatus: boolean;
  },
  user: TJWTPayload,
  appointmentId: string
) => {
  const { appointmentStatus } = payload;
  const { id } = user;

  // get doctor id
  const [doctor]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM doctor WHERE userId = ?`,
    [id]
  );

  if (!doctor || doctor.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found!");
  }

  const doctorId = doctor[0].id;

  // get appointment id
  const [appointment]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM appointment WHERE id = ? AND doctorId = ?`,
    [appointmentId, doctorId]
  );

  if (!appointment || appointment.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Appointment not found!");
  }

  // update appointment
  const [result]: [ResultSetHeader, any] = await db.query(
    `UPDATE appointment SET appointmentStatus = ? WHERE id = ?`,
    [appointmentStatus, appointmentId]
  );

  return result;
};

// delete appointment
const deleteAppointmentById = async (appointmentId: string) => {
  const [result]: [ResultSetHeader, any] = await db.query(
    `DELETE FROM appointment WHERE id = ?`,
    [appointmentId]
  );

  return result;
};

// complete appointment
const completeAppointment = async (appointmentId: string) => {
  const [result]: [ResultSetHeader, any] = await db.query(
    `UPDATE appointment SET isComplete = 1 WHERE id = ?`,
    [appointmentId]
  );

  return result;
};

// appointment statistics
const appointmentStatistics = async () => {
  let connection: PoolConnection;

  // Get a connection from the pool
  connection = await db.getConnection();

  // Start the transaction
  await connection.beginTransaction();

  try {
    // count successful appointments
    const [successfulAppointments]: [RowDataPacket[], any] =
      await connection.query(
        `SELECT COUNT(*) as count FROM appointment WHERE isComplete = 1`
      );

    // count female patient appointments
    const [femaleAppointments]: [RowDataPacket[], any] = await connection.query(
      `SELECT COUNT(*) as count FROM appointment a
       JOIN patient p ON a.patientId = p.id
       JOIN user u ON p.userId = u.id
       WHERE u.gender = 'female'`
    );

    // count male patient appointments
    const [maleAppointments]: [RowDataPacket[], any] = await connection.query(
      `SELECT COUNT(*) as count FROM appointment a
       JOIN patient p ON a.patientId = p.id
       JOIN user u ON p.userId = u.id
       WHERE u.gender = 'male'`
    );

    // count rejected appointments
    const [rejectedAppointments]: [RowDataPacket[], any] =
      await connection.query(
        `SELECT COUNT(*) as count FROM appointment WHERE appointmentStatus = 0`
      );

    // count approved appointments
    const [approvedAppointments]: [RowDataPacket[], any] =
      await connection.query(
        `SELECT COUNT(*) as count FROM appointment WHERE appointmentStatus = 1`
      );

    // count total appointments
    const [totalAppointments]: [RowDataPacket[], any] = await connection.query(
      `SELECT COUNT(*) as count FROM appointment`
    );

    await connection.commit();

    return {
      totalAppointments: totalAppointments[0].count,
      successfulAppointments: successfulAppointments[0].count,
      femaleAppointments: femaleAppointments[0].count,
      maleAppointments: maleAppointments[0].count,
      rejectedAppointments: rejectedAppointments[0].count,
      approvedAppointments: approvedAppointments[0].count,
    };
  } catch (error) {
    await connection.rollback();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal server error!"
    );
  } finally {
    connection.release();
  }
};

export const appointmentService = {
  createNewAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointmentById,
  deleteAppointmentById,
  completeAppointment,
  appointmentStatistics,
};
