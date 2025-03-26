import { z } from "zod";
import { PaymentGateway, PaymentStatus, BookingStatus } from "@prisma/client";

const createBookingSchema = z.object({
  booking_cart: z
    .array(
      z.object({
        event_id: z.string({
          required_error: "Event ID is required",
        }),
        quantity: z.number({
          required_error: "Quantity is required",
        }),
      })
    )
    .min(1, {
      message: "at least one cart item is required",
    }),
  total_price: z.number({
    required_error: "Total price is required",
  }),
  payment_gateway: z.enum([PaymentGateway.PAYPAL, PaymentGateway.GOOGLE_PAY], {
    required_error: "Payment gateway is required",
  }),
});

const updateBookingSchema = z.object({
  status: z.enum(
    [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    {
      required_error: "Booking status is required",
    }
  ),
});

export const bookingValidation = {
  createBookingSchema,
  updateBookingSchema,
};
