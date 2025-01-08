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
exports.updateThread = exports.deleteThread = exports.createThreads = exports.getThreads = exports.getThreadsByuserId = exports.getThread = void 0;
const threadService = __importStar(require("../services/threadService"));
const errorHandler_1 = require("../utils/errorHandler");
const getThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const threadId = req.params.threadId;
        res.status(200).json(yield threadService.getThread(threadId));
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.getThread = getThread;
const getThreadsByuserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        res.status(200).json(yield threadService.getThreadbyUserid(userId));
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.getThreadsByuserId = getThreadsByuserId;
const getThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(yield threadService.getThreads());
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.getThreads = getThreads;
const createThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        body.userId = res.locals.userId;
        const files = req.files;
        res.status(200).json(yield threadService.createThread(body, files));
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.createThreads = createThreads;
const deleteThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const threadId = req.params.threadId;
        const userId = res.locals.userId;
        res.status(201).json(yield threadService.deletethread(threadId, userId));
    }
    catch (error) {
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.deleteThread = deleteThread;
const updateThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const threadId = req.params.threadId;
        const body = req.body;
        body.userId = res.locals.userId;
        body.updateAt = new Date();
        const files = req.files;
        res
            .status(200)
            .json(yield threadService.updateThread(threadId, body, files));
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.updateThread = updateThread;
