import { GENDER, UserRole, UserStatus } from "@prisma/client";

export interface IParams {
  searchTerm: string;
  gender: GENDER;
  status: UserStatus;
  role: UserRole;
}
