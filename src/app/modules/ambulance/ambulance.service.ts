import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TAmbulance, TAmbulanceCategory } from "../../types";
import generateUniqueId from "../../utils/generateUniqueId";
import db from "../../database/db";

// create ambulance category
const createAmbulanceCategory = async (payload: TAmbulanceCategory) => {
  const categoryId = generateUniqueId();

  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO ambulance_category (id, categoryName) VALUES (?, ?)`,
    [categoryId, payload.categoryName]
  );

  return result;
};

// register ambulance
const registerAmbulance = async (payload: TAmbulance) => {
  const {
    ambulanceCategoryId,
    ownerName,
    area,
    location,
    district,
    pricePerKm,
    contactNumber,
  } = payload;

  const ambulanceId = generateUniqueId();

  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO ambulance (id, ambulanceCategoryId, ownerName, area, location, district, pricePerKm, contactNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ambulanceId,
      ambulanceCategoryId,
      ownerName,
      area,
      location,
      district,
      pricePerKm,
      contactNumber,
    ]
  );

  return result;
};

// get all ambulance by area
const getAllAmbulanceByArea = async (areaName: string) => {
  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT 
      ambulance.id,
      ambulance.ownerName,
      ambulance.area,
      ambulance.location,
      ambulance.district,
      ambulance.pricePerKm,
      ambulance.contactNumber,
      ambulance_category.categoryName
    FROM ambulance
    INNER JOIN ambulance_category
    ON ambulance.ambulanceCategoryId = ambulance_category.id
    WHERE ambulance.area LIKE ?`,
    [`%${areaName}%`]
  );

  return result;
};

// update ambulance information
const updateAmbulanceInformation = async (
  payload: Partial<TAmbulance>,
  id: string
) => {
  const {
    ambulanceCategoryId,
    ownerName,
    area,
    location,
    district,
    pricePerKm,
    contactNumber,
  } = payload;

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];

  if (ambulanceCategoryId) {
    fieldsToUpdate.push("ambulanceCategoryId");
    valuesToUpdate.push(ambulanceCategoryId);
  }

  if (ownerName) {
    fieldsToUpdate.push("ownerName = ?");
    valuesToUpdate.push(ownerName);
  }

  if (area) {
    fieldsToUpdate.push("area = ?");
    valuesToUpdate.push(area);
  }

  if (location) {
    fieldsToUpdate.push("location = ?");
    valuesToUpdate.push(location);
  }

  if (district) {
    fieldsToUpdate.push("district = ?");
    valuesToUpdate.push(district);
  }

  if (pricePerKm) {
    fieldsToUpdate.push("pricePerKm = ?");
    valuesToUpdate.push(pricePerKm);
  }

  if (contactNumber) {
    fieldsToUpdate.push("contactNumber = ?");
    valuesToUpdate.push(contactNumber);
  }

  valuesToUpdate.push(id);

  const query = `UPDATE ambulance SET ${fieldsToUpdate.join(
    ", "
  )} WHERE id = ?`;

  const [result]: [ResultSetHeader, any] = await db.query(query, [
    ...valuesToUpdate,
  ]);

  return result;
};

// delete ambulance information
const deleteAmbulanceInformation = async (id: string) => {
  const [result]: [ResultSetHeader, any] = await db.query(
    `DELETE FROM ambulance WHERE id = ?`,
    [id]
  );

  return result;
};

// get total ambulance number
const getTotalAmbulanceNumber = async () => {};

export const ambulanceService = {
  createAmbulanceCategory,
  registerAmbulance,
  getAllAmbulanceByArea,
  updateAmbulanceInformation,
  deleteAmbulanceInformation,
  getTotalAmbulanceNumber,
};
