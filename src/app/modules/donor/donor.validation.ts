import { z } from "zod";

const registerDonorSchema = z.object({
  lastDonationDate: z.string().optional(),
  isAvailable: z
    .number()
    .min(0, "Is available must be 0 or 1")
    .max(1, "Is available must be 0 or 1")
    .optional(),
});

const createDonationRequestSchema = z.object({
  donorId: z.string({
    required_error: "Donor ID is required",
    invalid_type_error: "Donor ID must be a string",
  }),
  location: z.string({
    required_error: "Location is required",
    invalid_type_error: "Location must be a string",
  }),
  donationDateTime: z.string({
    required_error: "Donation date and time is required",
    invalid_type_error: "Donation date and time must be a string",
  }),
  emergencyContact: z.string({
    required_error: "Emergency contact is required",
    invalid_type_error: "Emergency contact must be a string",
  }),
});

const updateDonationRequestSchema = z.object({
  requestStatus: z.enum(["approved", "pending", "rejected"], {
    message: "Status must be approved/pending/rejected",
  }),
});

const updateDonorInformationSchema = z.object({
  lastDonationDate: z.string().optional(),
  isAvailable: z
    .number()
    .min(0, "Is available must be 0 or 1")
    .max(1, "Is available must be 0 or 1")
    .optional(),
});

const sendMessageSchema = z.object({
  receiverId: z.string({
    required_error: "Receiver ID is required",
    invalid_type_error: "Receiver ID must be a string",
  }),
  content: z.string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string",
  }),
});
export const bloodDonationValidationSchema = {
  registerDonorSchema,
  createDonationRequestSchema,
  updateDonationRequestSchema,
  updateDonorInformationSchema,
  sendMessageSchema,
};
