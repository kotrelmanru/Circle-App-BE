import { Thread } from "@prisma/client";
import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";
import cloudinary from "../config";
import fs from "fs";

export const createThread = async (
  body: Thread,
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const thread = await db.thread.create({
    data: body,
  });

  if (files.image) {
    let image_url: string[] = [];
    for (const file of files.image) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "circle53",
      });
      fs.unlinkSync(file.path);
      image_url.push(result.secure_url);
    }
    await db.image.createMany({
      data: image_url.map((img) => ({
        imageUrl: img,
        threadId: thread.id,
      })),
    });
  }

  return thread;
};

export const getThread = async (id: string) => {
  return await db.thread.findFirst({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          profile: true,
        },
      },
      images: {
        select: {
          imageUrl: true,
        },
      },
      like: true,
      reply: {
        select: {
          author: {
            include: {
              profile: true,
            },
          },
          content: true,
          createdAt: true,
          id: true,
          images: true,
          like: true,
          reply: {
            select: {
              author: {
                include: {
                  profile: true,
                },
              },
              content: true,
              createdAt: true,
              id: true,
              images: true,
              like: true,
              reply: {
                select: {
                  author: {
                    include: {
                      profile: true,
                    },
                  },
                  content: true,
                  createdAt: true,
                  id: true,
                  images: true,
                  like: true,
                  reply: true,
                  threadId: true,
                  updatedAt: true,
                },
              },
              threadId: true,
              updatedAt: true,
            },
          },
          threadId: true,
          updatedAt: true,
        },
      },
    },
  });
};
export const getThreadbyUserid = async (id: string) => {
  return await db.thread.findMany({
    where: {
      userId: id,
    },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          profile: true,
        },
      },
      images: {
        select: {
          imageUrl: true,
        },
      },
      like: true,
      reply: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getThreads = async () => {
  return await db.thread.findMany({
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          profile: true,
        },
      },
      images: {
        select: {
          imageUrl: true,
        },
      },
      like: true,
      reply: {
        include: {
          author: {
            select: {
              id: true,
              fullname: true,
            },
          },
          images: {
            select: {
              imageUrl: true,
            },
          },
          like: true,
          reply: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateThread = async (
  threadId: string,
  body: Thread,
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const checkThread = await db.thread.findUnique({
    where: { id: threadId, userId: body.userId },
  });

  if (!checkThread) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  const updateThread = await db.thread.update({
    where: { id: checkThread.id },
    data: {
      content: body.content,
      updatedAt: body.updatedAt,
    },
  });

  const checkImage = await db.image.findMany({
    where: {
      threadId: threadId,
    },
  });

  if (!checkImage) {
    return updateThread;
  }

  const image = await db.image.findMany({
    where: { threadId: threadId },
  });

  image.forEach(async (image) => {
    const publicId = image.imageUrl.split("/").pop()?.split(".")[0];
    cloudinary.uploader.destroy(publicId as string);
  });

  await db.image.deleteMany({
    where: { threadId: threadId },
  });

  if (files.image) {
    let image_url: string[] = [];
    for (const file of files.image) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "circle53",
      });
      fs.unlinkSync(file.path);
      image_url.push(result.secure_url);
    }
    await db.image.createMany({
      data: image_url.map((img) => ({
        imageUrl: img,
        threadId: checkThread.id,
      })),
    });
  }

  return updateThread;
};

export const deletethread = async (threadId: string, userId: string) => {
  const thread = await db.thread.findFirst({
    where: { id: threadId },
  });

  if (!thread) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  if (thread?.userId !== userId) {
    throw new Error("your not the author");
  }

  const image = await db.image.findMany({
    where: { threadId: thread.id },
  });

  image.forEach(async (image) => {
    const publicId = image.imageUrl.split("/").pop()?.split(".")[0];
    cloudinary.uploader.destroy(publicId as string);
  });

  const deleteThread = await db.thread.delete({
    where: { id: threadId },
  });
  return { message: "delete succes", deleteThread };
};