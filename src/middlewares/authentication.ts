import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

const authentication = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as User;

    if (!decoded) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }
    res.locals.userId = decoded.id;
    next();
  } catch (error) {
    const err = error as unknown as Error;
    console.log(err);

    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export default authentication;
