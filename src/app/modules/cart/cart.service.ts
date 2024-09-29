import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../database/db";
import generateUniqueId from "../../utils/generateUniqueId";
import { TJWTPayload } from "../../types";

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

// remove item to cart
const removeItemToCart = async () => {};

// get all cart items
const getAllCartItems = async () => {};

export const cartService = {
  addItemToCart,
  removeItemToCart,
  getAllCartItems,
};
