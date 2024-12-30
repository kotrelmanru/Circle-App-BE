import { Request, Response } from "express";
import * as likeService from "../services/likeService";
import { errorHandler } from "../utils/errorHandler";

export const like = async (req: Request, res: Response) => {
  try {
    const threadId = req.params.threadId;
    const userId = res.locals.userId;

    return res.status(200).json(await likeService.like(threadId, userId));
  } catch (error) {
    return errorHandler(error, res);
  }
};
