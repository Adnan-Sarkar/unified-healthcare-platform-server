import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const errorResponse = {
    success: false,
    statusCode: 500,
    message: error.message || "error message",
    errorDetails: error,
  };

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;

  errorResponse.statusCode = statusCode;

  if (error instanceof ZodError) {
    errorResponse.message = error?.issues
      .map((issue) => {
        return (issue.message as string).concat(".");
      })
      .join(" ");
    statusCode = httpStatus.BAD_REQUEST;
  }

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
