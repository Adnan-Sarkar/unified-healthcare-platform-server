import { TJWTPayload } from "../types";

declare global {
  namespace Express {
    interface Request {
      user: TJWTPayload;
    }
  }
}
