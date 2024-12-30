import { Router } from "express";
import * as followController from "../controllers/followController";
import authentication from "../middlewares/authentication";

const followRouter = Router();

followRouter.post(
  "/follow/:followerId",
  authentication,
  followController.follow
);

export default followRouter;
