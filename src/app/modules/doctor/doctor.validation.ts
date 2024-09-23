import { z } from "zod";

const registerDoctorSchema = z.object({
  userInfo: z
    .object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      bloodGroup: z.string().optional(),
      gender: z.enum(["male", "female"]).optional(),
      phone: z.string().min(10),
      dateOfBirth: z.string(),
      location: z.string().optional(),
      profilePicture: z.string().url().optional(),
    })
    .partial(),

  doctorInfo: z
    .object({
      doctorBio: z.string().min(10, "Bio must be at least 10 characters long"),
      professionStartDate: z.string(),
      consultationFee: z
        .number()
        .min(0, "Consultation fee must be a positive number"),
    })
    .partial(),
});

const doctorQualificationSchema = z.array(
  z.object({
    qualification: z.string({
      required_error: "Qualification is required",
      invalid_type_error: "Qualification must be a string",
    }),
    isRemove: z.boolean(),
  })
);

const doctorSpecializationSchema = z.array(
  z.object({
    specializationId: z.string({
      required_error: "Specialization ID is required",
      invalid_type_error: "Specialization ID must be a string",
    }),
    isRemove: z.boolean(),
  })
);

const doctorDayTimeSchema = z.array(
  z.object({
    dayTimeId: z.string({
      required_error: "Day time ID is required",
      invalid_type_error: "Day time ID must be a string",
    }),
    isRemove: z.boolean(),
  })
);

const doctorUpdateSchema = z.object({
  doctorInfo: z
    .object({
      doctorBio: z
        .string()
        .min(10, "Bio must be at least 10 characters")
        .optional(),
      professionStartDate: z.string().optional(),
      consultationFee: z
        .number()
        .min(0, "Consultation fee must be a positive number")
        .optional(),
    })
    .optional(),

  doctorQualification: doctorQualificationSchema.optional(),

  doctorSpecialization: doctorSpecializationSchema.optional(),

  doctorDayTime: doctorDayTimeSchema.optional(),
});

export const doctorValidationSchema = {
  registerDoctorSchema,
  doctorUpdateSchema,
};
