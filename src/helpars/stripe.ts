import Stripe from "stripe";
import ApiError from "../errors/ApiErrors";
import httpStatus from "http-status";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const stripeCreatePaymentIntent = async ({
  amount,
  currency = "usd",
  paymentMethodId,
  captureMethod = "automatic",
  metadata,
}: {
  amount: number;
  currency?: string;
  paymentMethodId: string;
  captureMethod?: "automatic_async" | "automatic" | "manual";
  metadata?: Record<string, any>;
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      metadata: metadata,
      payment_method: paymentMethodId,
      confirm: true,
      capture_method: captureMethod,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const stripeRefundPayment = async (paymentIntentId: string) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return refund;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to refund payment"
    );
  }
};
