import { z } from "zod";
import { BloodGroup } from "../../constant/bloodGroup";

// registration user
const updateUserSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name must be string",
    })
    .optional(),

  lastName: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be string",
    })
    .optional(),

  password: z
    .string()
    .min(6, { message: "Password should be at least 6 digits" }),

  phone: z
    .string()
    .min(10, { message: "Phone number should be at least 10 digits" })
    .optional(),

  location: z
    .string()
    .min(2, { message: "Location should be at least 2 characters long" })
    .optional(),

  profilePicture: z
    .string()
    .url({ message: "Invalid URL for profile picture" })
    .optional(),
});

export const userValidationSchema = {
  updateUserSchema,
};
