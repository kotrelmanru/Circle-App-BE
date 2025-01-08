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
exports.deleteReply = exports.updateReply = exports.createReply = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const createReply = (body, files) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield db_1.default.thread.create({
        data: {
            content: body.content,
            userId: body.userId,
            threadId: body.threadId,
        },
    });
    if ((files === null || files === void 0 ? void 0 : files.image) && files.image.length > 0) {
        let image_url = [];
        for (const file of files.image) {
            const result = yield config_1.default.uploader.upload(file.path, {
                folder: "circle53",
            });
            fs_1.default.unlinkSync(file.path);
            image_url.push(result.secure_url);
        }
        yield db_1.default.image.createMany({
            data: image_url.map((img) => ({
                imageUrl: img,
                threadId: reply.id,
            })),
        });
    }
    return reply;
});
exports.createReply = createReply;
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
const updateReply = (id, body, files) => __awaiter(void 0, void 0, void 0, function* () {
    const checkReply = yield db_1.default.thread.findFirst({
        where: { id: id, userId: body.userId },
    });
    if (!checkReply) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    const updateReply = yield db_1.default.thread.update({
        where: { id },
        data: {
            content: body.content,
            updatedAt: body.updatedAt,
        },
    });
    const checkImage = yield db_1.default.image.findMany({
        where: {
            threadId: id,
        },
    });
    if (!checkImage) {
        return updateReply;
    }
    const image = yield db_1.default.image.findMany({
        where: { threadId: id },
    });
    image.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const publicId = (_a = image.imageUrl.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
        config_1.default.uploader.destroy(publicId);
    }));
    yield db_1.default.image.deleteMany({
        where: { threadId: id },
    });
    if (files.image) {
        let image_url = [];
        for (const file of files.image) {
            const result = yield config_1.default.uploader.upload(file.path, {
                folder: "circle53",
            });
            fs_1.default.unlinkSync(file.path);
            image_url.push(result.secure_url);
        }
        yield db_1.default.image.createMany({
            data: image_url.map((img) => ({
                imageUrl: img,
                threadId: checkReply.id,
            })),
        });
    }
    return updateReply;
});
exports.updateReply = updateReply;
const deleteReply = (replyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const thread = yield db_1.default.thread.findFirst({
        where: { id: replyId },
    });
    if (!thread) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    if ((thread === null || thread === void 0 ? void 0 : thread.userId) !== userId) {
        throw new Error("your not the author");
    }
    const image = yield db_1.default.image.findMany({
        where: { threadId: thread.id },
    });
    image.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const publicId = (_b = image.imageUrl.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split(".")[0];
        config_1.default.uploader.destroy(publicId);
    }));
    const deleteReply = yield db_1.default.thread.delete({
        where: { id: replyId },
    });
    return { message: "delete succes", deleteReply };
});
exports.deleteReply = deleteReply;
