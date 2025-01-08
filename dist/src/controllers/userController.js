"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUserByName = exports.getSugestedUser = exports.getLoginUser = exports.getSingleUser = void 0;
const userService = __importStar(require("../services/userService"));
const errorHandler_1 = require("../utils/errorHandler");
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const dataUser = yield userService.getSingleUser({ id });
        res.status(200).json(dataUser);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.getSingleUser = getSingleUser;
const getLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.userId;
        const dataUser = yield userService.getSingleUser({ id });
        res.status(200).json(dataUser);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.getLoginUser = getLoginUser;
const getSugestedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        // Ambil daftar suggested users dari service
        const suggestedUsers = yield userService.getSugestedUser(userId);
        // Filter dan urutkan sesuai dengan prioritas
        const enrichedUsers = suggestedUsers.map((user) => {
            const isFollowingUs = user.follower.some((follow) => follow.followerId === userId);
            return Object.assign(Object.assign({}, user), { isFollowingUs, followerCount: user.follower.length });
        });
        const sortedUsers = enrichedUsers.sort((a, b) => {
            // Prioritaskan pengguna yang sudah follow kita
            if (a.isFollowingUs && !b.isFollowingUs)
                return -1;
            if (!a.isFollowingUs && b.isFollowingUs)
                return 1;
            // Jika prioritas sama, urutkan berdasarkan jumlah follower
            return b.followerCount - a.followerCount;
        });
        return res.status(200).json(sortedUsers);
    }
    catch (error) {
        const err = error;
        return res.status(500).json({
            message: err.message,
        });
    }
});
exports.getSugestedUser = getSugestedUser;
const getUserByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const fullname = req.params.name;
        const dataUser = yield userService.getUserByName(fullname, userId);
        res.status(200).json(dataUser);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.getUserByName = getUserByName;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const dataInsertUser = yield userService.createUser(body);
        res.status(200).json(dataInsertUser);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.createUser = createUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const messageDeleteUser = yield userService.deleteUser(userId);
        res.status(200).json({ message: messageDeleteUser });
    }
    catch (error) {
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const userId = res.locals.userId;
        const dataUpdateUser = yield userService.updateUser(userId, body);
        res.status(200).json(dataUpdateUser);
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.updateUser = updateUser;
