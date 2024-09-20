import express from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { patientRoutes } from "../modules/patient/patient.route";
import { bloodDonationRoutes } from "../modules/donor/donor.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { medicineRoutes } from "../modules/medicine/medicine.route";
import { ambulanceRoutes } from "../modules/ambulance/ambulance.route";
import { hospitalRoutes } from "../modules/hospital/hospital.route";
import { blogRoutes } from "../modules/blog/blog.route";
import { appointmentRoutes } from "../modules/appointment/appointment.route";
import { cartRoutes } from "../modules/cart/cart.route";

const router = express.Router();

const routes = [
  {
    path: "/auth",
    router: authRoutes,
  },
  {
    path: "/patient",
    router: patientRoutes,
  },
  {
    path: "/blood-donation",
    router: bloodDonationRoutes,
  },
  {
    path: "/doctor",
    router: doctorRoutes,
  },
  {
    path: "/medicine",
    router: medicineRoutes,
  },
  {
    path: "/ambulance",
    router: ambulanceRoutes,
  },
  {
    path: "/hospital",
    router: hospitalRoutes,
  },
  {
    path: "/blog",
    router: blogRoutes,
  },
  {
    path: "/appointment",
    router: appointmentRoutes,
  },
  {
    path: "/cart",
    router: cartRoutes,
  },
];

routes?.map((route) => {
  router.use(route.path, route.router);
});

export default router;
