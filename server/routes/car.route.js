import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addCar, getCars, deleteCar } from "../controllers/car.controller.js";

const router = express.Router();

router.post("/add", verifyToken, addCar);
router.get("/getcars", verifyToken, getCars);
router.delete("/deletecar/:carId/:userId", verifyToken, deleteCar);

export default router;
