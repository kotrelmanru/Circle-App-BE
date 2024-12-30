import { Request, Response } from "express";
import * as threadService from "../services/threadService";
import { errorHandler } from "../utils/errorHandler";

export const getThread = async (req: Request, res: Response) => {
  try {
    const threadId = req.params.threadId;
    res.status(200).json(await threadService.getThread(threadId));
  } catch (error) {
    errorHandler(error, res);
  }
};
export const getThreadsByuserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    res.status(200).json(await threadService.getThreadbyUserid(userId));
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getThreads = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await threadService.getThreads());
  } catch (error) {
    errorHandler(error, res);
  }
};

export const createThreads = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    body.userId = res.locals.userId;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    res.status(200).json(await threadService.createThread(body, files));
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteThread = async (req: Request, res: Response) => {
  try {
    const threadId = req.params.threadId;
    const userId = res.locals.userId;

    res.status(201).json(await threadService.deletethread(threadId, userId));
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const updateThread = async (req: Request, res: Response) => {
  try {
    const threadId = req.params.threadId;
    const body = req.body;
    body.userId = res.locals.userId;
    body.updateAt = new Date();

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    res
      .status(200)
      .json(await threadService.updateThread(threadId, body, files));
  } catch (error) {
    errorHandler(error, res);
  }
};
