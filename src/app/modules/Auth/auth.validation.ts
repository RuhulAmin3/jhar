import { GENDER, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const registerUserValidationSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  gender: z.nativeEnum(GENDER),
  password: z.string(),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  status: z.nativeEnum(UserStatus).default(UserStatus.PENDING),
});

const loginUserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const authValidation = {
  changePasswordValidationSchema,
  registerUserValidationSchema,
  loginUserValidationSchema,
};
