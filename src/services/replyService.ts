import { Thread } from "@prisma/client";
import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";
import cloudinary from "../config";
import fs from "fs";

export const createReply = async (
  body: { content: string; userId: string; threadId?: string },
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const reply = await db.thread.create({
    data: {
      content: body.content,
      userId: body.userId,
      threadId: body.threadId,
    },
  });

  if (files?.image && files.image.length > 0) {
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
        threadId: reply.id,
      })),
    });
  }

  return reply;
};


// export const createReply = async (
//   body: Thread,
//   files: { [fieldname: string]: Express.Multer.File[] }
// ) => {
//   const reply = await db.thread.create({
//     data: body,
//   });

//   if (files.image) {
//     let image_url: string[] = [];
//     for (const file of files.image) {
//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "circle53",
//       });
//       fs.unlinkSync(file.path);
//       image_url.push(result.secure_url);
//     }
//     await db.image.createMany({
//       data: image_url.map((img) => ({
//         imageUrl: img,
//         threadId: reply.id,
//       })),
//     });
//   }

//   return reply;
// };

export const updateReply = async (
  id: string,
  body: Thread,
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const checkReply = await db.thread.findFirst({
    where: { id: id, userId: body.userId },
  });

  if (!checkReply) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  const updateReply = await db.thread.update({
    where: { id },
    data: {
      content: body.content,
      updatedAt: body.updatedAt,
    },
  });

  const checkImage = await db.image.findMany({
    where: {
      threadId: id,
    },
  });

  if (!checkImage) {
    return updateReply;
  }

  const image = await db.image.findMany({
    where: { threadId: id },
  });

  image.forEach(async (image) => {
    const publicId = image.imageUrl.split("/").pop()?.split(".")[0];
    cloudinary.uploader.destroy(publicId as string);
  });

  await db.image.deleteMany({
    where: { threadId: id },
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
        threadId: checkReply.id,
      })),
    });
  }

  return updateReply;
};

export const deleteReply = async (replyId: string, userId: string) => {
  const thread = await db.thread.findFirst({
    where: { id: replyId },
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

  const deleteReply = await db.thread.delete({
    where: { id: replyId },
  });
  return { message: "delete succes", deleteReply };
};
