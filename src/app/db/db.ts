import { UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";

export const initiateSuperAdmin = async () => {
  const payload: any = {
    full_name: "Ruhul Amin",
    email: "dev.ruhulamin3@gmail.com",
    password: "$2a$12$RrLsWWlsDbibVfc7WTPHiOGMznN0d07MQ.LHTAF.GM5aeAmNPudmW",
    role: UserRole.SUPER_ADMIN,
  };

  const isExistUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isExistUser) return;

  await prisma.user.create({
    data: payload,
  });
};
