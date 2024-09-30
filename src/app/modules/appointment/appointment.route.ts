import express from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { appointmentValidationSchema } from "./appointment.validation";

const router = express.Router();

router.get(
  "/user-appointment/:id",
  auth("user", "admin", "super_admin"),
  appointmentController.getUserAppointments
);

router.get(
  "/doctor-appointment/:id",
  auth("doctor", "admin", "super_admin"),
  appointmentController.getDoctorAppointments
);

router.get(
  "/statistics",
  auth("admin", "super_admin"),
  appointmentController.appointmentStatistics
);

router.post(
  "/register-appointment",
  auth("user", "patient"),
  validateRequest(
    appointmentValidationSchema.registerAppointmentValidationSchema
  ),
  appointmentController.createNewAppointment
);

router.patch(
  "/:id",
  auth("doctor"),
  appointmentController.updateAppointmentById
);

router.patch(
  "/complete/:id",
  auth("doctor"),
  appointmentController.completeAppointment
);

router.delete(
  "/:id",
  auth("super_admin"),
  appointmentController.deleteAppointmentById
);

export const appointmentRoutes = router;
