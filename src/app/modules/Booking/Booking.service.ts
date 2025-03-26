import {
  Booking,
  BookingCart,
  BookingStatus,
  PaymentGateway,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { stripeCreatePaymentIntent } from "../../../helpars/stripe";

const createBooking = async (
  userId: string,
  payload: Booking & { paymentMethodId?: string }
) => {
  const { booking_cart, payment_gateway, total_price, paymentMethodId } =
    payload;
  // Start a Prisma transaction
  const booking = await prisma.$transaction(async (tsx) => {
    // Step 1: Check if all events exist and if there is enough capacity
    const events = await Promise.all(
      booking_cart.map(async (cart: BookingCart) => {
        const { event_id, quantity } = cart;
        const event = await tsx.event.findUnique({
          where: { id: event_id },
        });

        if (!event) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Event not found");
        }

        if (event.capacity < quantity) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Not enough seats available for the event ${event.title}`
          );
        }

        // Temporarily reserve the capacity by decrementing it for the requested quantity
        await tsx.event.update({
          where: { id: event.id },
          data: { capacity: { decrement: quantity } },
        });

        return { event, quantity };
      })
    );

    // Step 2: Handle payment if using Google Pay
    let paymentIntentId;

    if (payment_gateway === PaymentGateway.GOOGLE_PAY && paymentMethodId) {
      const payment = await stripeCreatePaymentIntent({
        amount: total_price,
        paymentMethodId,
      });

      if (payment.status !== "succeeded") {
        // Rollback capacity reservation if payment fails
        await Promise.all(
          events.map(async ({ event, quantity }) => {
            // Restore the capacity to the event
            await tsx.event.update({
              where: { id: event.id },
              data: { capacity: { increment: quantity } },
            });
          })
        );
        throw new ApiError(httpStatus.BAD_REQUEST, "Payment failed");
      }

      paymentIntentId = payment.id;
    }

    // Step 3: Create the booking only after successful payment
    const newBooking = await tsx.booking.create({
      data: {
        ...payload,
        user_id: userId,
        payment_status: PaymentStatus.COMPLETED,
        payment_intent_id: paymentIntentId as string,
      },
    });

    // Step 4: Return the booking
    return newBooking;
  });

  return booking;
};

const getAllBookings = async (
  options: IPaginationOptions,
  params: { userId?: string; status?: string }
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { userId, status } = params;

  const andConditions: Prisma.BookingWhereInput[] = [];

  if (userId) {
    andConditions.push({
      user_id: userId,
    });
  }

  if (status) {
    andConditions.push({
      status: status as BookingStatus,
    });
  }

  const whereConditions: Prisma.BookingWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      booking_cart: true,
    },
  });

  const total = await prisma.booking.count({
    where: whereConditions,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No bookings found");
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getBooking = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      booking_cart: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

const updateBooking = async (
  id: string,
  payload: Prisma.BookingUpdateInput
) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: payload,
  });

  return updatedBooking;
};

const deleteBooking = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Booking not found");
  }

  await prisma.booking.delete({
    where: { id },
  });
};

const updateBookingStatus = async (id: string, status: BookingStatus) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Booking not found");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status },
  });

  return updatedBooking;
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
};
