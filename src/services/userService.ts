import { User } from "@prisma/client";
import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";

export const createUser = async (body: User): Promise<User> => {
  return db.user.create({
    data: body,
  });
};

export const getSingleUser = async (condition: {
  [key: string]: string;
}): Promise<User | null> => {
  return db.user.findFirst({
    where: condition,
    include: {
      // Ambil hanya data follow yang aktif (isFollow = true)
      follower: {
        where: { isFollow: true },
        select: {
          followerId: true,
          followingId: true,
          following: {
            select: {
              id: true,
              fullname: true,
              profile: true,
            },
          },
        },
      },
      following: {
        where: { isFollow: true },
        select: {
          follower: {
            select: {
              id: true,
              fullname: true,
              profile: true,
            },
          },
          followerId: true,
          followingId: true,
        },
      },
      profile: true,
      threads: true,
    },
  });
};

export const getUserByName = async (
  fullname: string,
  loggedInUserId: string
): Promise<User[] | null> => {
  return await db.user.findMany({
    where: {
      fullname: {
        contains: fullname,
        mode: "insensitive",
      },
      id: {
        not: loggedInUserId,
      },
    },
    include: {
      // Ambil follower dan following yang aktif (isFollow = true)
      follower: {
        where: { isFollow: true },
        select: {
          follower: {
            select: {
              id: true,
              fullname: true,
              profile: true,
            },
          },
        },
      },
      following: {
        where: { isFollow: true },
        select: {
          following: {
            select: {
              id: true,
              fullname: true,
              profile: true,
            },
          },
        },
      },
      profile: true,
      threads: true,
    },
  });
};

export const updateUser = async (
  id: string,
  body: User
): Promise<User | Error> => {
  const existUser = await db.user.findFirst({
    where: {
      id,
    },
  });

  if (!existUser) {
    throw new Error("User tidak ditemukan!");
  }
  return db.user.update({
    where: {
      id,
    },
    data: body,
  });
};

export const deleteUser = async (id: string): Promise<string> => {
  const existUser = await db.user.findFirst({
    where: {
      id,
    },
  });

  if (!existUser) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  await db.user.delete({
    where: {
      id,
    },
  });

  return "Sukses delete user dengan id " + id;
};

export const getSugestedUser = async (loggedInUserId: string) => {
  const suggestedUsers = await db.user.findMany({
    where: {
      id: {
        not: loggedInUserId, // Bukan pengguna yang login
      },
      follower: {
        none: {
          followingId: loggedInUserId, // Tidak ada relasi follow aktif
          isFollow: true,
        },
      },
    },
    include: {
      follower: {
        where: { isFollow: true },
        select: {
          followerId: true,
        },
      },
    },
  });

  return suggestedUsers;
};
