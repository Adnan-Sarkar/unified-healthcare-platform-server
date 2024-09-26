import { z } from "zod";

const createMedicineCategorySchema = z.object({
  categoryName: z.string({
    required_error: "Category name is required",
    invalid_type_error: "Category name must be a string",
  }),
});

const registerMedicineSchema = z.object({
  name: z.string({
    required_error: "Medicine name is required",
    invalid_type_error: "Medicine name must be a string",
  }),
  brandName: z.string({
    required_error: "Brand name is required",
    invalid_type_error: "Brand name must be a string",
  }),
  categoryId: z.string({
    required_error: "Category ID is required",
    invalid_type_error: "Category ID must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  discount: z
    .number({
      required_error: "Discount is required",
      invalid_type_error: "Discount must be a number",
    })
    .min(0, "Discount must be 0 or more")
    .max(100, "Discount must be 100 or less"),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
  stockQuantity: z.number({
    required_error: "Stock quantity is required",
    invalid_type_error: "Stock quantity must be a number",
  }),
  photo: z.string({
    required_error: "Photo URL is required",
    invalid_type_error: "Photo URL must be a string",
  }),
});

const updateMedicineSchema = z.object({
  name: z
    .string({
      required_error: "Medicine name is required",
      invalid_type_error: "Medicine name must be a string",
    })
    .optional(),
  brandName: z
    .string({
      required_error: "Brand name is required",
      invalid_type_error: "Brand name must be a string",
    })
    .optional(),
  categoryId: z.string({
    required_error: "Category ID is required",
    invalid_type_error: "Category ID must be a string",
  }),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  discount: z
    .number({
      required_error: "Discount is required",
      invalid_type_error: "Discount must be a number",
    })
    .min(0, "Discount must be 0 or more")
    .max(100, "Discount must be 100 or less")
    .optional(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .optional(),
  stockQuantity: z
    .number({
      required_error: "Stock quantity is required",
      invalid_type_error: "Stock quantity must be a number",
    })
    .optional(),
  photo: z
    .string({
      required_error: "Photo URL is required",
      invalid_type_error: "Photo URL must be a string",
    })
    .optional(),
});

export const medicineValidationSchema = {
  createMedicineCategorySchema,
  registerMedicineSchema,
  updateMedicineSchema,
};
