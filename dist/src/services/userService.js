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
exports.getSugestedUser = exports.deleteUser = exports.updateUser = exports.getUserByName = exports.getSingleUser = exports.createUser = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const createUser = (body) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.create({
        data: body,
    });
});
exports.createUser = createUser;
const getSingleUser = (condition) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findFirst({
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
});
exports.getSingleUser = getSingleUser;
const getUserByName = (fullname, loggedInUserId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.user.findMany({
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
});
exports.getUserByName = getUserByName;
const updateUser = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield db_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!existUser) {
        throw new Error("User tidak ditemukan!");
    }
    return db_1.default.user.update({
        where: {
            id,
        },
        data: body,
    });
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield db_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!existUser) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    yield db_1.default.user.delete({
        where: {
            id,
        },
    });
    return "Sukses delete user dengan id " + id;
});
exports.deleteUser = deleteUser;
const getSugestedUser = (loggedInUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const suggestedUsers = yield db_1.default.user.findMany({
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
});
exports.getSugestedUser = getSugestedUser;
