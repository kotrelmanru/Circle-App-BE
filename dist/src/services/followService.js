"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.follow = void 0;
// src/services/followService.ts
const db_1 = __importDefault(require("../lib/db"));
const follow = (followerId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    // Cek apakah followerId dan followingId ada di database
    const follower = yield db_1.default.user.findUnique({ where: { id: followerId } });
    const following = yield db_1.default.user.findUnique({ where: { id: followingId } });
    // Jika followerId atau followingId tidak ditemukan
    if (!follower) {
        throw new Error("Follower user ID not found");
    }
    if (!following) {
        throw new Error("Following user ID not found");
    }
    // Cek apakah pengguna sudah mengikuti
    const existingFollow = yield db_1.default.follow.findFirst({
        where: {
            followerId,
            followingId,
        },
    });
    // Jika sudah follow, maka lakukan unfollow
    if (existingFollow) {
        yield db_1.default.follow.deleteMany({
            where: {
                followerId,
                followingId,
            },
        });
        return "unfollowing successful";
    }
    // Jika belum follow, maka lakukan follow
    const follow = yield db_1.default.follow.create({
        data: {
            followerId,
            followingId,
        },
    });
    return "following successful";
});
exports.follow = follow;
