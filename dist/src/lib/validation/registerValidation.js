"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schemaRegister = joi_1.default.object({
    fullname: joi_1.default.string().required().min(5),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(8),
});
exports.default = schemaRegister;
