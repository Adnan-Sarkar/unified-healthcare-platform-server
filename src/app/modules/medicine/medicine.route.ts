import express from "express";
import { medicineController } from "./medicine.controller";

const router = express.Router();

router.get("/", medicineController.getAllMedicines);

router.get("/:id", medicineController.getSingleMedicineById);

router.post("/add-medicine", medicineController.addNewMedicine);

router.patch("/:id", medicineController.updateMedicineInformation);

router.delete("/:id", medicineController.deleteMedicineInformation);

export const medicineRoutes = router;
