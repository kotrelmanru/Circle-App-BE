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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const profileService = __importStar(require("../services/profileService"));
const errorHandler_1 = require("../utils/errorHandler");
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const body = req.body;
        const userId = res.locals.userId;
        const files = req.files;
        const photoProfile = (_a = files === null || files === void 0 ? void 0 : files.photoProfile) === null || _a === void 0 ? void 0 : _a[0];
        const cover = (_b = files === null || files === void 0 ? void 0 : files.cover) === null || _b === void 0 ? void 0 : _b[0];
        if (photoProfile) {
            const photoProfilePath = path_1.default.resolve(photoProfile.path);
            const cloudUpload = yield config_1.default.uploader.upload(photoProfilePath, {
                folder: "circle53",
            });
            fs_1.default.unlinkSync(photoProfilePath);
            body.photoProfile = cloudUpload.secure_url;
        }
        if (cover) {
            const coverPath = path_1.default.resolve(cover.path);
            const cloudUpload = yield config_1.default.uploader.upload(coverPath, {
                folder: "circle53",
            });
            fs_1.default.unlinkSync(coverPath);
            body.cover = cloudUpload.secure_url;
        }
        yield profileService.updateProfile(body, userId);
        return res.status(200).json({
            message: "Profile updated successfully",
            status: true,
        });
    }
    catch (error) {
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.updateProfile = updateProfile;
