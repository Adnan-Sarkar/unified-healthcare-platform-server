import { z } from "zod";

const registerHospitalSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  area: z.string({
    required_error: "Area is required",
  }),
  district: z.string({
    required_error: "District is required",
  }),
  location: z.string({
    required_error: "Location is required",
  }),
  website: z.string({
    required_error: "Website is required",
  }),
  contactNumber: z.string({
    required_error: "Contact number is required",
  }),
});

const updateHospitalSchema = z.object({
  name: z.string().optional(),
  area: z.string().optional(),
  district: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  contactNumber: z.string().optional(),
});

export const hospitalValidationSchema = {
  registerHospitalSchema,
  updateHospitalSchema,
};
