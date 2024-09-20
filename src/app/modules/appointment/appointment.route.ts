import express from "express";
import { appointmentController } from "./appointment.controller";

const router = express.Router();

router.get(
  "/user-appointment/:id",
  appointmentController.getUserAppointmentById
);

router.get(
  "/doctor-appointment/:id",
  appointmentController.getDoctorAppointmentById
);

router.get("/meta-data", appointmentController.countTotalAppointments);

router.post(
  "/register-appointment",
  appointmentController.createNewAppointment
);

router.patch("/:id", appointmentController.updateAppointmentById);

router.delete("/:id", appointmentController.deleteAppointmentById);

export const appointmentRoutes = router;
