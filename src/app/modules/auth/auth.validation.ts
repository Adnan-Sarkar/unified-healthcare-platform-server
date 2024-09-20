import { z } from "zod";
import { BloodGroup } from "../../constant/bloodGroup";

// registration user
const registerUserSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
    invalid_type_error: "First name must be string",
  }),

  lastName: z.string({
    required_error: "Last name is required",
    invalid_type_error: "Last name must be string",
  }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password should be at least 6 digits" }),

  gender: z.enum(["male", "female"], {
    message: "Invalid gender value",
  }),

  phone: z
    .string()
    .min(10, { message: "Phone number should be at least 10 digits" }),

  location: z
    .string()
    .min(2, { message: "Location should be at least 2 characters long" }),

  dateOfBirth: z.string({
    required_error: "Date of birth is required",
    invalid_type_error: "Date of birth must be string",
  }),

  bloodGroup: z.enum(BloodGroup as [string, ...string[]], {
    message: "Invalid blood group",
  }),

  profilePicture: z
    .string()
    .url({ message: "Invalid URL for profile picture" }),
});

// login user
const loginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password should be at least 6 digits" }),
});

export const authValidationSchema = {
  registerUserSchema,
  loginUserSchema,
};
