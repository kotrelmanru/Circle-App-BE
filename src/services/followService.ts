// src/services/followService.ts
import db from "../lib/db";

export const follow = async (followerId: string, followingId: string) => {
  // Cek apakah followerId dan followingId ada di database
  const follower = await db.user.findUnique({ where: { id: followerId } });
  const following = await db.user.findUnique({ where: { id: followingId } });

  // Jika followerId atau followingId tidak ditemukan
  if (!follower) {
    throw new Error("Follower user ID not found");
  }

  if (!following) {
    throw new Error("Following user ID not found");
  }

  // Cek apakah pengguna sudah mengikuti
  const existingFollow = await db.follow.findFirst({
    where: {
      followerId,
      followingId,
    },
  });

  // Jika sudah follow, maka lakukan unfollow
  if (existingFollow) {
    await db.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    return "unfollowing successful";
  }

  // Jika belum follow, maka lakukan follow
  const follow = await db.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return "following successful";
};
