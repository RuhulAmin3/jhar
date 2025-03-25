import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const CreateUserValidationSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  status: z.nativeEnum(UserStatus).default(UserStatus.PENDING),
});

export const UserValidation = {
  CreateUserValidationSchema,
};
