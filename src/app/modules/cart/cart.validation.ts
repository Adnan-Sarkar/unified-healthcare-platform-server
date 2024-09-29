import { z } from "zod";

// add item to cart validation
const addItemToCartValidationSchema = z.object({
  medicineId: z.string({
    required_error: "Medicine ID is required",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .int()
    .positive({
      message: "Quantity must be a positive integer",
    }),
});

// remove item to cart validation
const removeItemToCartValidationSchema = z.object({
  medicineId: z.string({
    required_error: "Medicine ID is required",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .int()
    .positive({
      message: "Quantity must be a positive integer",
    }),
});

export const cartValidationSchema = {
  addItemToCartValidationSchema,
  removeItemToCartValidationSchema,
};
