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
exports.like = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const like = (threadId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedThread = yield db_1.default.thread.findFirst({
        where: { id: threadId },
        include: {
            like: true,
        },
    });
    if (!selectedThread)
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    const existtingLike = yield db_1.default.like.findFirst({
        where: { userId: userId, threadId: threadId },
    });
    if (existtingLike) {
        const deleteLike = yield db_1.default.like.delete({
            where: { userId_threadId: existtingLike },
        });
        return { deleteLike, message: "unlike success" };
    }
    const like = yield db_1.default.like.create({
        data: {
            threadId: threadId,
            userId: userId,
        },
    });
    return { like, message: "like success" };
});
exports.like = like;
