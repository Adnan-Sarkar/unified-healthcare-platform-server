import { TAccountStatus } from "./users";

export type TJWTPayload = {
  id: string;
  accountStatus: TAccountStatus;
  email: string;
  roles: string[];
};
