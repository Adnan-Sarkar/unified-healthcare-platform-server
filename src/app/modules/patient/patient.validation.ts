import { z } from "zod";

// registration patient
const registerPatientSchema = z.object({
  patientData: z
    .object({
      allergies: z.string().optional(),
      medicalHistory: z.string().optional(),
    })
    .optional(),

  patientDocuments: z.array(z.string()).optional(),
});

// update patient
const updatePatientSchema = z.object({
  patientData: z
    .object({
      allergies: z.string().optional(),
      medicalHistory: z.string().optional(),
    })
    .optional(),

  patientDocuments: z
    .array(
      z.object({
        documentImageUrl: z.string().url(),
        isRemove: z.boolean(),
      })
    )
    .optional(),
});

export const patientValidationSchema = {
  registerPatientSchema,
  updatePatientSchema,
};
