import { UserRole, UserStatus } from "@prisma/client";

export interface IParams {
  searchTerm: string;
  status: UserStatus;
  role: UserRole;
}
