import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { UserRole } from "../types";

const auth = (...userRoles: (keyof typeof UserRole)[]) => {
  return catchAsync((req, _res, next) => {
    const token = req.headers.authorization as string;

    if (!token) {
      throw new Error("You are not authorized!");
    }

    let verifiedUser;

    try {
      verifiedUser = jwt.verify(
        token,
        config.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      req.user = {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role,
      };

      if (userRoles.length > 0 && !userRoles.includes(verifiedUser.role)) {
        throw new Error("You are forbidden!");
      } else {
        next();
      }
    } catch (error: any) {
      next(error);
    }
  });
};

export default auth;
