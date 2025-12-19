// Shared user types that don't import Prisma client
// This allows these types to be used in Edge runtime (middleware)

export enum UserRole {
  GUEST = "GUEST",
  COMPANY = "COMPANY",
  ALUMNI = "ALUMNI",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export enum AccountStatus {
  UNVERIFIED = "UNVERIFIED",
  VERIFIED = "VERIFIED",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

export type User = {
  id: string;
  email: string;
  role: UserRole;
  username: string;
  avatarUrl: string;
  displayName: string | null;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
};
