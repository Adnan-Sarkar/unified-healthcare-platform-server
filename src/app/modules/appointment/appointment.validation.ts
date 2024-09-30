import { z } from "zod";

const registerAppointmentValidationSchema = z.object({
  paymentStatus: z.string({
    required_error: "Payment status is required",
  }),
  doctorId: z.string({
    required_error: "Doctor ID is required",
  }),
  day: z.string({
    required_error: "Day is required",
  }),
  date: z.string({
    required_error: "Date is required",
  }),
  timeSlot: z.string({
    required_error: "Time slot is required",
  }),
  note: z.string().optional(),
});

export const appointmentValidationSchema = {
  registerAppointmentValidationSchema,
};
