import { UserRole } from "./userRole";

export type TJWTPayload = {
  id: string;
  name: string;
  email: string;
  role: keyof typeof UserRole;
};
