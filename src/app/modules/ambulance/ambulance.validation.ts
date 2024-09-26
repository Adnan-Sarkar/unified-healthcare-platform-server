import { z } from "zod";

const createAmbulanceCategorySchema = z.object({
  categoryName: z.string({
    required_error: "Category name is required",
  }),
});

const registerAmbulanceSchema = z.object({
  ambulanceCategoryId: z.string({
    required_error: "Category id is required",
  }),
  ownerName: z.string({
    required_error: "Ambulance owner name is required",
  }),
  area: z.string({
    required_error: "Ambulance area is required",
  }),
  location: z.string({
    required_error: "Ambulance location is required",
  }),
  district: z.string({
    required_error: "Ambulance district is required",
  }),
  pricePerKm: z.number({
    required_error: "Ambulance price per kilometer is required",
  }),
  contactNumber: z.string({
    required_error: "Ambulance contact number is required",
  }),
});

const updateAmbulanceSchema = z.object({
  ambulanceCategoryId: z.string().optional(),
  ownerName: z.string().optional(),
  area: z.string().optional(),
  location: z.string().optional(),
  district: z.string().optional(),
  pricePerKm: z.number().optional(),
  contactNumber: z.string().optional(),
});

export const ambulanceValidationSchema = {
  createAmbulanceCategorySchema,
  registerAmbulanceSchema,
  updateAmbulanceSchema,
};
