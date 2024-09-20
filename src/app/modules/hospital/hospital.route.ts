import express from "express";
import { hospitalController } from "./hospital.controller";

const router = express.Router();

router.get("/", hospitalController.getHospitalsByArea);

router.post("/register-hospital", hospitalController.registerHospital);

router.patch("/:id", hospitalController.updateHospitalInformation);

router.delete("/:id", hospitalController.deleteHospitalInformation);

export const hospitalRoutes = router;
