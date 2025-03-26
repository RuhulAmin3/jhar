import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { paypalService } from "./Paypal.service";

// Controller to create a PayPal order
const createPayPalOrderController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || !userId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Amount and user ID are required"
      );
    }

    const { orderId, approvalLink } = await paypalService.createPaypalPayment(
      amount,
      userId
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "PayPal order created successfully!",
      data: { orderId, approvalLink },
    });
  }
);

// Controller to capture the PayPal payment after approval
const capturePayPalPaymentController = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId, userId } = req.body;

    if (!orderId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
    }

    const captureResult = await paypalService.capturePaypalPayment(
      orderId, 
      userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment capture successfully",
      data: captureResult,
    });
  }
);

export const paypalController = {
  capturePayPalPaymentController,
  createPayPalOrderController,
};
