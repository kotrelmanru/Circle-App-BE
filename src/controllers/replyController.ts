import * as replyService from "../services/replyService";
import { Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";

export const createReply = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    body.userId = res.locals.userId;
    const threadId = req.params.threadId;
    body.threadId = threadId;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    return res.status(200).json(await replyService.createReply(body, files));
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const deleteReply = async (req: Request, res: Response) => {
  try {
    const replyId = req.params.replyId;
    const userId = res.locals.userId;

    res.status(201).json(await replyService.deleteReply(replyId, userId));
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const updateReply = async (req: Request, res: Response) => {
  try {
    const replyId = req.params.replyId;
    const body = req.body;
    body.userId = res.locals.userId;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    res.status(200).json(await replyService.updateReply(replyId, body, files));
  } catch (error) {
    errorHandler(error, res);
  }
};
