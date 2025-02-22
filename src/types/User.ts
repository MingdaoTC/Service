export type roleType = "alumni" | "company" | "admin";

export type User = {
  id: string;
  username: string;
  displayName: string;
  website?: string;
  phone: string;
  email: string;
  description?: string;
  role: roleType;
  verified: boolean;
  application?: any[];
  createdAt: Date;
  updatedAt: Date;
};
