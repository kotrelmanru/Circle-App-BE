import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";

export const like = async (threadId: string, userId: string) => {
  const selectedThread = await db.thread.findFirst({
    where: { id: threadId },
    include: {
      like: true,
    },
  });
  if (!selectedThread) throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);

  const existtingLike = await db.like.findFirst({
    where: { userId: userId, threadId: threadId },
  });

  if (existtingLike) {
    const deleteLike = await db.like.delete({
      where: { userId_threadId: existtingLike },
    });
    return { deleteLike, message: "unlike success" };
  }
  const like = await db.like.create({
    data: {
      threadId: threadId,
      userId: userId,
    },
  });

  return { like, message: "like success" };
};
