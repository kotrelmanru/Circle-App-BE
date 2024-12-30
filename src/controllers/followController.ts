// src/controllers/followController.ts
import * as followService from "../services/followService";
import { Request, Response } from "express";

export const follow = async (req: Request, res: Response) => {
  try {
    const followerId = req.params.followerId; // ID user yang mengikuti
    const followingId = res.locals.userId; // ID user yang diikuti (dari token)

    // Panggil fungsi follow/unfollow dari followService
    const result = await followService.follow(followerId, followingId);

    return res.status(200).json({ message: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Menangani error yang spesifik untuk user tidak terdaftar
      if (error.message === "Follower user ID not found") {
        return res.status(404).json({ error: "Follower user ID not found" });
      } 
      if (error.message === "Following user ID not found") {
        return res.status(404).json({ error: "Following user ID not found" });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
