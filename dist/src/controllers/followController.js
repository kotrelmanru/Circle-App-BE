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
exports.follow = void 0;
// src/controllers/followController.ts
const followService = __importStar(require("../services/followService"));
const follow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = req.params.followerId; // ID user yang mengikuti
        const followingId = res.locals.userId; // ID user yang diikuti (dari token)
        // Panggil fungsi follow/unfollow dari followService
        const result = yield followService.follow(followerId, followingId);
        return res.status(200).json({ message: result });
    }
    catch (error) {
        if (error instanceof Error) {
            // Menangani error yang spesifik untuk user tidak terdaftar
            if (error.message === "Follower user ID not found") {
                return res.status(404).json({ error: "Follower user ID not found" });
            }
            if (error.message === "Following user ID not found") {
                return res.status(404).json({ error: "Following user ID not found" });
            }
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
});
exports.follow = follow;
