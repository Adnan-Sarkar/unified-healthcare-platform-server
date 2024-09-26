import { ResultSetHeader, RowDataPacket } from "mysql2";
import { THospital } from "../../types";
import generateUniqueId from "../../utils/generateUniqueId";
import db from "../../database/db";

// register hospital
const registerHospital = async (payload: THospital) => {
  const { name, area, district, location, website, contactNumber } = payload;
  const hospitalId = generateUniqueId();

  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO hospital (id, name, area, district, location, website, contactNumber) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [hospitalId, name, area, district, location, website, contactNumber]
  );

  return result;
};

// get hospitals by area
const getHospitalsByArea = async (payload: { area: string }) => {
  const { area } = payload;
  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT * FROM hospital WHERE area LIKE ?`,
    [`%${area}%`]
  );

  return result;
};

// update hospital information
const updateHospitalInformation = async (
  payload: Partial<THospital>,
  id: string
) => {
  const { name, area, district, location, website, contactNumber } = payload;

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];

  if (name) {
    fieldsToUpdate.push("name = ?");
    valuesToUpdate.push(name);
  }

  if (area) {
    fieldsToUpdate.push("area = ?");
    valuesToUpdate.push(area);
  }

  if (district) {
    fieldsToUpdate.push("district = ?");
    valuesToUpdate.push(district);
  }

  if (location) {
    fieldsToUpdate.push("location = ?");
    valuesToUpdate.push(location);
  }

  if (website) {
    fieldsToUpdate.push("website = ?");
    valuesToUpdate.push(website);
  }

  if (contactNumber) {
    fieldsToUpdate.push("contact_number = ?");
    valuesToUpdate.push(contactNumber);
  }

  const query = `UPDATE hospital SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
  const [result]: [ResultSetHeader, any] = await db.query(query, [
    ...valuesToUpdate,
    id,
  ]);

  return result;
};

// delete hospital information
const deleteHospitalInformation = async (hospitalId: string) => {
  const [result]: [ResultSetHeader, any] = await db.query(
    `DELETE FROM hospital WHERE id = ?`,
    [hospitalId]
  );

  return result;
};

export const hospitalService = {
  registerHospital,
  getHospitalsByArea,
  updateHospitalInformation,
  deleteHospitalInformation,
};
