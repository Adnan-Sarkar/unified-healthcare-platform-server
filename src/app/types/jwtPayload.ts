import { UserRole } from "./userRole";
import { TAccountStatus } from "./users";

export type TJWTPayload = {
  id: string;
  accountStatus: TAccountStatus;
  email: string;
  role: keyof typeof UserRole;
};
