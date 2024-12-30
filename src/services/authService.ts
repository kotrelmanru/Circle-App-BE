import * as userService from "./userService";
import { User, UserProfile } from "@prisma/client";
import schemaRegister from "../lib/validation/registerValidation";
import { ERROR_MESSAGE } from "../utils/constant/error";
import bcrypt from "bcrypt";
import loginSchema from "../lib/validation/loginValidation";
import jwt from "jsonwebtoken";
import db from "../lib/db";

export const register = async (
  body: User
): Promise<{ id: string; userProfile: UserProfile }> => {
  const { error, value } = schemaRegister.validate(body);
  if (error?.details) {
    throw new Error(ERROR_MESSAGE.WRONG_INPUT);
  }

  const existEmail = await userService.getSingleUser({
    email: value.email,
  });
  if (existEmail) {
    throw new Error(ERROR_MESSAGE.EXISTED_DATA);
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);

  const user = await userService.createUser({
    ...value,
    password: hashedPassword,
  });
  const username = `user_${user.id
    .substring(0, 8)
    .replace(/-/g, "")}_${body.fullname.replace(/\s/g, "_")}`;

  const userProfile = await db.userProfile.create({
    data: {
      username: username,
      userId: user.id,
      photoProfile: "",
      cover: "",
      bio: "",
    },
  });
  return { id: user.id, userProfile };
};

export const login = async (body: User): Promise<{ token: string }> => {
  // 1. validate input
  const { error, value } = loginSchema.validate(body);

  if (error?.details) {
    throw new Error(ERROR_MESSAGE.WRONG_INPUT);
  }

  // 2. check existing email
  const existEmail = await db.user.findFirst({
    where: { email: value.email },
    include: {
      profile: true,
    },
  });

  if (!existEmail) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  // 3. check password
  const isMatch = await bcrypt.compare(value.password, existEmail.password);
  if (!isMatch) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  const token = jwt.sign(existEmail, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });

  return { token };
};
