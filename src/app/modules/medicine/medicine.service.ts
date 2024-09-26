import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../database/db";
import { TMedicine, TMedicineCategory } from "../../types";
import generateUniqueId from "../../utils/generateUniqueId";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// add new medicine category
const addNewMedicineCategory = async (payload: Partial<TMedicineCategory>) => {
  const { categoryName } = payload;

  const categoryId = generateUniqueId();
  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO medicine_category (id, categoryName ) VALUES (?, ?)`,
    [categoryId, categoryName]
  );

  return result;
};

// add new medicine
const addNewMedicine = async (payload: Partial<TMedicine>) => {
  const {
    name,
    brandName,
    categoryId,
    description,
    discount,
    price,
    stockQuantity,
    photo,
  } = payload;

  const medicineId = generateUniqueId();
  const [result]: [ResultSetHeader, any] = await db.query(
    `INSERT INTO medicine (id, name, brandName, categoryId, description, discount, price, stockQuantity, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      medicineId,
      name,
      brandName,
      categoryId,
      description,
      discount,
      price,
      stockQuantity,
      photo,
    ]
  );

  return result;
};

// get all medicines
const getAllMedicines = async () => {
  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT 
      medicine.id, 
      medicine.name, 
      medicine.brandName, 
      medicine.description, 
      medicine.price, 
      medicine.discount, 
      medicine.stockQuantity, 
      medicine.photo, 
      medicine_category.categoryName 
    FROM medicine 
    INNER JOIN medicine_category 
    ON medicine.categoryId = medicine_category.id`
  );

  return result;
};

// get single medicine by id
const getSingleMedicineById = async (medicineId: string) => {
  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT 
      medicine.id, 
      medicine.name, 
      medicine.brandName, 
      medicine.description, 
      medicine.price, 
      medicine.discount, 
      medicine.stockQuantity, 
      medicine.photo, 
      medicine_category.categoryName
    FROM medicine
    INNER JOIN medicine_category
    ON medicine.categoryId = medicine_category.id
    WHERE medicine.id = ?`,
    [medicineId]
  );

  console.log(medicineId);

  return result;
};

// update medicine information
const updateMedicineInformation = async (
  payload: Partial<TMedicine>,
  medicineId: string
) => {
  const {
    name,
    brandName,
    categoryId,
    description,
    discount,
    price,
    stockQuantity,
    photo,
  } = payload;

  const fieldsToUpdate: string[] = [];
  const valuesToUpdate: any[] = [];

  if (name) {
    fieldsToUpdate.push("name = ?");
    valuesToUpdate.push(name);
  }

  if (brandName) {
    fieldsToUpdate.push("brandName = ?");
    valuesToUpdate.push(brandName);
  }

  if (categoryId) {
    fieldsToUpdate.push("categoryId = ?");
    valuesToUpdate.push(categoryId);
  }

  if (description) {
    fieldsToUpdate.push("description = ?");
    valuesToUpdate.push(description);
  }

  if (typeof discount === "number") {
    fieldsToUpdate.push("discount = ?");
    valuesToUpdate.push(discount);
  }

  if (price) {
    fieldsToUpdate.push("price = ?");
    valuesToUpdate.push(price);
  }

  if (stockQuantity) {
    fieldsToUpdate.push("stockQuantity = ?");
    valuesToUpdate.push(stockQuantity);
  }

  if (photo) {
    fieldsToUpdate.push("photo = ?");
    valuesToUpdate.push(photo);
  }

  const query = `UPDATE medicine SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
  const [result]: [ResultSetHeader, any] = await db.query(query, [
    ...valuesToUpdate,
    medicineId,
  ]);

  return result;
};

// delete medicine information
const deleteMedicineInformation = async (medicineId: string) => {
  // check if medicine exists
  const [result]: [RowDataPacket[], any] = await db.query(
    `SELECT * FROM medicine WHERE id = ?`,
    [medicineId]
  );

  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Medicine not found");
  }

  const [deleteResult]: [ResultSetHeader, any] = await db.query(
    `DELETE FROM medicine WHERE id = ?`,
    [medicineId]
  );

  return deleteResult;
};

export const medicineService = {
  addNewMedicineCategory,
  addNewMedicine,
  getAllMedicines,
  getSingleMedicineById,
  updateMedicineInformation,
  deleteMedicineInformation,
};
