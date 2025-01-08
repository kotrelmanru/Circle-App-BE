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
exports.login = exports.register = void 0;
const userService = __importStar(require("./userService"));
const registerValidation_1 = __importDefault(require("../lib/validation/registerValidation"));
const error_1 = require("../utils/constant/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginValidation_1 = __importDefault(require("../lib/validation/loginValidation"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../lib/db"));
const register = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = registerValidation_1.default.validate(body);
    if (error === null || error === void 0 ? void 0 : error.details) {
        throw new Error(error_1.ERROR_MESSAGE.WRONG_INPUT);
    }
    const existEmail = yield userService.getSingleUser({
        email: value.email,
    });
    if (existEmail) {
        throw new Error(error_1.ERROR_MESSAGE.EXISTED_DATA);
    }
    const hashedPassword = yield bcrypt_1.default.hash(value.password, 10);
    const user = yield userService.createUser(Object.assign(Object.assign({}, value), { password: hashedPassword }));
    const username = `user_${user.id
        .substring(0, 8)
        .replace(/-/g, "")}_${body.fullname.replace(/\s/g, "_")}`;
    const userProfile = yield db_1.default.userProfile.create({
        data: {
            username: username,
            userId: user.id,
            photoProfile: "",
            cover: "",
            bio: "",
        },
    });
    return { id: user.id, userProfile };
});
exports.register = register;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. validate input
    const { error, value } = loginValidation_1.default.validate(body);
    if (error === null || error === void 0 ? void 0 : error.details) {
        throw new Error(error_1.ERROR_MESSAGE.WRONG_INPUT);
    }
    // 2. check existing email
    const existEmail = yield db_1.default.user.findFirst({
        where: { email: value.email },
        include: {
            profile: true,
        },
    });
    if (!existEmail) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    // 3. check password
    const isMatch = yield bcrypt_1.default.compare(value.password, existEmail.password);
    if (!isMatch) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    const token = jsonwebtoken_1.default.sign(existEmail, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });
    return { token };
});
exports.login = login;
