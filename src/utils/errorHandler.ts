import { Response } from "express";
import { ERROR_OBJECT } from "./constant/error";

export const errorHandler = (error: unknown, res: Response) => {
   const errorMessage = (error as Error).message;

   let response = ERROR_OBJECT[errorMessage] || {
      statusCode: 500,
      message: errorMessage,
   };

   res.status(response.statusCode).json({ message: response.message });
};
