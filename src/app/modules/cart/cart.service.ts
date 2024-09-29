import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../database/db";
import generateUniqueId from "../../utils/generateUniqueId";
import { TJWTPayload } from "../../types";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// add item to cart
const addItemToCart = async (
  payload: {
    medicineId: string;
    quantity: number;
  },
  user: TJWTPayload
) => {
  const userId = user.id;
  const { medicineId, quantity } = payload;
  // first check user has a cart or not
  const [cartResult]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM cart WHERE userId = ?`,
    [userId]
  );

  let cartId: string;

  if (cartResult.length === 0) {
    // if cart not found, then create a new cart
    cartId = generateUniqueId();
    await db.query(`INSERT INTO cart (id, userId) VALUES (?, ?)`, [
      cartId,
      userId,
    ]);
  } else {
    cartId = cartResult[0].id;
  }

  // check medicine already in cart or not
  const [existingItemResult]: [RowDataPacket[], any] = await db.query(
    `SELECT id, quantity FROM cart_item WHERE cartId = ? AND medicineId = ?`,
    [cartId, medicineId]
  );

  if (existingItemResult.length > 0) {
    // if medicine already in cart, then update quantity
    const newQuantity = existingItemResult[0].quantity + quantity;
    const [result]: [ResultSetHeader, any] = await db.query(
      `UPDATE cart_item SET quantity = ? WHERE id = ?`,
      [newQuantity, existingItemResult[0].id]
    );

    return result;
  } else {
    // if medicine not in cart, then add a new cart item
    const cartItemId = generateUniqueId();
    const [result]: [ResultSetHeader, any] = await db.query(
      `INSERT INTO cart_item (id, cartId, medicineId, quantity) VALUES (?, ?, ?, ?)`,
      [cartItemId, cartId, medicineId, quantity]
    );

    return result;
  }
};

// get cart
const getCartItems = async (user: TJWTPayload) => {
  const userId = user.id;

  const [cartResult]: [RowDataPacket[], any] = await db.query(
    `SELECT
    c.id as cartId,
    ci.id as cartItemId,
    m.id as medicineId,
    m.image,
    m.name,
    m.price,
    ci.quantity,
     FROM cart c
     JOIN cart_item ci ON c.id = ci.cartId
     JOIN medicine m ON ci.medicineId = m.id
     WHERE c.userId = ?`,
    [userId]
  );

  return cartResult;
};

// remove item to cart
const removeItemToCart = async (
  payload: {
    medicineId: string;
    quantity: number;
  },
  user: TJWTPayload
) => {
  const userId = user.id;
  const { medicineId, quantity } = payload;

  // first find cart id
  const [cartResult]: [RowDataPacket[], any] = await db.query(
    `SELECT id FROM cart WHERE userId = ?`,
    [userId]
  );

  if (cartResult.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const cartId = cartResult[0].id;

  // find cart item
  const [cartItemResult]: [RowDataPacket[], any] = await db.query(
    `SELECT id, quantity FROM cart_item WHERE cartId = ? AND medicineId = ?`,
    [cartId, medicineId]
  );

  if (cartItemResult.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Medicine not found in cart");
  }

  const cartItemId = cartItemResult[0].id;
  const currentQuantity = cartItemResult[0].quantity;

  if (currentQuantity <= quantity) {
    // if current quantity is less than or equal to the quantity, then delete the item
    const [result]: [ResultSetHeader, any] = await db.query(
      `DELETE FROM cart_item WHERE id = ?`,
      [cartItemId]
    );

    return result;
  } else {
    // if current quantity is greater than the quantity, then decrease the quantity
    const newQuantity = currentQuantity - quantity;
    const [result]: [ResultSetHeader, any] = await db.query(
      `UPDATE cart_item SET quantity = ? WHERE id = ?`,
      [newQuantity, cartItemId]
    );

    return result;
  }
};

export const cartService = {
  addItemToCart,
  getCartItems,
  removeItemToCart,
};
