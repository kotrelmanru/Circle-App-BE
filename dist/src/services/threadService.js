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
exports.deletethread = exports.updateThread = exports.getThreads = exports.getThreadbyUserid = exports.getThread = exports.createThread = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const createThread = (body, files) => __awaiter(void 0, void 0, void 0, function* () {
    const thread = yield db_1.default.thread.create({
        data: body,
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
                threadId: thread.id,
            })),
        });
    }
    return thread;
});
exports.createThread = createThread;
const getThread = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.thread.findFirst({
        where: {
            id,
        },
        include: {
            author: {
                select: {
                    id: true,
                    fullname: true,
                    profile: true,
                },
            },
            images: {
                select: {
                    imageUrl: true,
                },
            },
            like: true,
            reply: {
                select: {
                    author: {
                        include: {
                            profile: true,
                        },
                    },
                    content: true,
                    createdAt: true,
                    id: true,
                    images: true,
                    like: true,
                    reply: {
                        select: {
                            author: {
                                include: {
                                    profile: true,
                                },
                            },
                            content: true,
                            createdAt: true,
                            id: true,
                            images: true,
                            like: true,
                            reply: {
                                select: {
                                    author: {
                                        include: {
                                            profile: true,
                                        },
                                    },
                                    content: true,
                                    createdAt: true,
                                    id: true,
                                    images: true,
                                    like: true,
                                    reply: true,
                                    threadId: true,
                                    updatedAt: true,
                                },
                            },
                            threadId: true,
                            updatedAt: true,
                        },
                    },
                    threadId: true,
                    updatedAt: true,
                },
            },
        },
    });
});
exports.getThread = getThread;
const getThreadbyUserid = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.thread.findMany({
        where: {
            userId: id,
        },
        include: {
            author: {
                select: {
                    id: true,
                    fullname: true,
                    profile: true,
                },
            },
            images: {
                select: {
                    imageUrl: true,
                },
            },
            like: true,
            reply: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
});
exports.getThreadbyUserid = getThreadbyUserid;
const getThreads = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.thread.findMany({
        include: {
            author: {
                select: {
                    id: true,
                    fullname: true,
                    profile: true,
                },
            },
            images: {
                select: {
                    imageUrl: true,
                },
            },
            like: true,
            reply: {
                include: {
                    author: {
                        select: {
                            id: true,
                            fullname: true,
                        },
                    },
                    images: {
                        select: {
                            imageUrl: true,
                        },
                    },
                    like: true,
                    reply: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
});
exports.getThreads = getThreads;
const updateThread = (threadId, body, files) => __awaiter(void 0, void 0, void 0, function* () {
    const checkThread = yield db_1.default.thread.findUnique({
        where: { id: threadId, userId: body.userId },
    });
    if (!checkThread) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    const updateThread = yield db_1.default.thread.update({
        where: { id: checkThread.id },
        data: {
            content: body.content,
            updatedAt: body.updatedAt,
        },
    });
    const checkImage = yield db_1.default.image.findMany({
        where: {
            threadId: threadId,
        },
    });
    if (!checkImage) {
        return updateThread;
    }
    const image = yield db_1.default.image.findMany({
        where: { threadId: threadId },
    });
    image.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const publicId = (_a = image.imageUrl.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
        config_1.default.uploader.destroy(publicId);
    }));
    yield db_1.default.image.deleteMany({
        where: { threadId: threadId },
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
                threadId: checkThread.id,
            })),
        });
    }
    return updateThread;
});
exports.updateThread = updateThread;
const deletethread = (threadId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const thread = yield db_1.default.thread.findFirst({
        where: { id: threadId },
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
    const deleteThread = yield db_1.default.thread.delete({
        where: { id: threadId },
    });
    return { message: "delete succes", deleteThread };
});
exports.deletethread = deletethread;
