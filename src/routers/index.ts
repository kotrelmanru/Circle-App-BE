import { Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import threadRouter from "./threadRouter";
import followRouter from "./followRouter";
import likeRouter from "./likeRouter";
import profileRouter from "./profileRouter";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/threads", threadRouter);
indexRouter.use("/profile", profileRouter);
indexRouter.use(followRouter);
indexRouter.use(likeRouter);

export default indexRouter;
