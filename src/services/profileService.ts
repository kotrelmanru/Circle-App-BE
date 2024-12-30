import { response } from "express";
import db from "../lib/db";
import { IProfile } from "../types/app";

export const updateProfile = async (body: IProfile, userId: string) => {
  await db.user.update({
    where: { id: userId },
    data: {
      fullname: body.fullname,
    },
  });

  const update = await db.userProfile.update({
    where: { userId: userId },
    data: {
      username: body.username,
      bio: body.bio,
      photoProfile: body.photoProfile,
      cover: body.cover,
    },
  });

  return update;
};
