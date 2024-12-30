import { Router } from "express";
import * as userController from "../controllers/userController";
import authentication from "../middlewares/authentication";

const userRouter = Router();

userRouter.get("/login", authentication, userController.getLoginUser);
userRouter.get("/suggested", authentication, userController.getSugestedUser);
userRouter.get("/", authentication, userController.getSugestedUser);
userRouter.get("/name/:name", authentication, userController.getUserByName);
userRouter.get("/:userId", authentication, userController.getSingleUser);
userRouter.post("/", userController.createUser);
userRouter.delete("/", authentication, userController.deleteUser);
userRouter.put("/", authentication, userController.updateUser);

export default userRouter;
