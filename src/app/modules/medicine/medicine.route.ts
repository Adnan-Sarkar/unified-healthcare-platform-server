import express from "express";
import { medicineController } from "./medicine.controller";
import validateRequest from "../../middleware/validateRequest";
import { medicineValidationSchema } from "./medicine.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", medicineController.getAllMedicines);

router.get("/:id", medicineController.getSingleMedicineById);

router.post(
  "/register-medicine",
  auth("admin", "super_admin"),
  validateRequest(medicineValidationSchema.registerMedicineSchema),
  medicineController.addNewMedicine
);

router.post(
  "/medicine-category",
  auth("admin", "super_admin"),
  validateRequest(medicineValidationSchema.createMedicineCategorySchema),
  medicineController.addNewMedicineCategory
);

router.patch(
  "/:id",
  auth("admin", "super_admin"),
  validateRequest(medicineValidationSchema.updateMedicineSchema),
  medicineController.updateMedicineInformation
);

router.delete(
  "/:id",
  auth("admin", "super_admin"),
  medicineController.deleteMedicineInformation
);

export const medicineRoutes = router;
