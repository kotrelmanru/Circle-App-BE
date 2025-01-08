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
exports.updateReply = exports.deleteReply = exports.createReply = void 0;
const replyService = __importStar(require("../services/replyService"));
const errorHandler_1 = require("../utils/errorHandler");
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        body.userId = res.locals.userId;
        const threadId = req.params.threadId;
        body.threadId = threadId;
        const files = req.files;
        return res.status(200).json(yield replyService.createReply(body, files));
    }
    catch (error) {
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.createReply = createReply;
const deleteReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replyId = req.params.replyId;
        const userId = res.locals.userId;
        res.status(201).json(yield replyService.deleteReply(replyId, userId));
    }
    catch (error) {
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.deleteReply = deleteReply;
const updateReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const replyId = req.params.replyId;
        const body = req.body;
        body.userId = res.locals.userId;
        const files = req.files;
        res.status(200).json(yield replyService.updateReply(replyId, body, files));
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.updateReply = updateReply;
