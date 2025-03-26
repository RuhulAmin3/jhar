import httpStatus from "http-status";
import { captureOrder, createOrder } from "../../../helpars/paypal";
import ApiError from "../../../errors/ApiErrors"; 

const createPaypalPayment = async (amount: string, userId: string) => {
  const response = await createOrder(amount, userId);
  return response;
};

const capturePaypalPayment = async (orderId: string, userId: string) => {
  const response = await captureOrder(orderId);

  if (!response || response.status !== "COMPLETED") {
    throw new ApiError(httpStatus.BAD_REQUEST, "PayPal payment failed");
  }

  // Validate response structure
  const purchaseUnit = response.purchase_units?.[0];
  const capture = purchaseUnit?.payments?.captures?.[0];

  if (!capture?.amount?.value) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid response structure from PayPal"
    );
  }

  const amount = +capture.amount.value;
  const id = capture.id;

  return { amount, transactionId: id };
};

export const paypalService = {
  createPaypalPayment,
  capturePaypalPayment,
};
