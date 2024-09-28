import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { config } from "../config";
import { UserRole } from "../types";
import AppError from "../error/AppError";
import httpStatus from "http-status";

const auth = (...userRoles: (keyof typeof UserRole)[]) => {
  return catchAsync(async (req, _res, next) => {
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

      const currentUserRoles = verifiedUser?.roles;

      req.user = {
        id: verifiedUser.id,
        accountStatus: verifiedUser.accountStatus,
        email: verifiedUser.email,
        roles: currentUserRoles,
      };

      if (
        userRoles.length > 0 &&
        !userRoles.some((role) => currentUserRoles.includes(role))
      ) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
      } else {
        next();
      }
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        return next(
          new AppError(
            httpStatus.BAD_REQUEST,
            "Token expired! Please log in again."
          )
        );
      } else {
        next(error);
      }
    }
  });
};

export default auth;
