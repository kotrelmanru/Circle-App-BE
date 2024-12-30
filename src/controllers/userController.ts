import { Request, Response } from "express";
import * as userService from "../services/userService";
import { errorHandler } from "../utils/errorHandler";
import { Console } from "console";

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;

    const dataUser = await userService.getSingleUser({ id });

    res.status(200).json(dataUser);
  } catch (error) {
    const err = error as unknown as Error;

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getLoginUser = async (req: Request, res: Response) => {
  try {
    const id = res.locals.userId;

    const dataUser = await userService.getSingleUser({ id });

    res.status(200).json(dataUser);
  } catch (error) {
    const err = error as unknown as Error;

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getSugestedUser = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    // Ambil daftar suggested users dari service
    const suggestedUsers = await userService.getSugestedUser(userId);

    // Filter dan urutkan sesuai dengan prioritas
    const enrichedUsers = suggestedUsers.map((user) => {
      const isFollowingUs = user.follower.some(
        (follow) => follow.followerId === userId
      );
      return {
        ...user,
        isFollowingUs,
        followerCount: user.follower.length, // Tambahkan jumlah follower
      };
    });

    const sortedUsers = enrichedUsers.sort((a, b) => {
      // Prioritaskan pengguna yang sudah follow kita
      if (a.isFollowingUs && !b.isFollowingUs) return -1;
      if (!a.isFollowingUs && b.isFollowingUs) return 1;

      // Jika prioritas sama, urutkan berdasarkan jumlah follower
      return b.followerCount - a.followerCount;
    });

    return res.status(200).json(sortedUsers);
  } catch (error) {
    const err = error as unknown as Error;

    return res.status(500).json({
      message: err.message,
    });
  }
};


export const getUserByName = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const fullname = req.params.name;

    const dataUser = await userService.getUserByName(fullname, userId);

    res.status(200).json(dataUser);
  } catch (error) {
    const err = error as unknown as Error;

    res.status(500).json({
      message: err.message,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { body } = req;

    const dataInsertUser = await userService.createUser(body);

    res.status(200).json(dataInsertUser);
  } catch (error) {
    const err = error as unknown as Error;

    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const messageDeleteUser = await userService.deleteUser(userId);

    res.status(200).json({ message: messageDeleteUser });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const userId = res.locals.userId;

    const dataUpdateUser = await userService.updateUser(userId, body);

    res.status(200).json(dataUpdateUser);
  } catch (error) {
    const err = error as unknown as Error;

    res.status(500).json({
      message: err.message,
    });
  }
};
