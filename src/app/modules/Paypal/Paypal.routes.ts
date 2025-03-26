import express from "express";
import { paypalController } from "./Paypal.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Create PayPal order
router.post(
  "/create-order",
  auth(UserRole.STUDENT),
  paypalController.createPayPalOrderController
);

// Capture PayPal payment
router.post(
  "/capture-payment",
  auth(UserRole.STUDENT),
  paypalController.capturePayPalPaymentController
);

export const paypalRoutes = router;
