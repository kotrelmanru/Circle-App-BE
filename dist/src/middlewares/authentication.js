"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
            });
        }
        res.locals.userId = decoded.id;
        next();
    }
    catch (error) {
        const err = error;
        console.log(err);
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
};
exports.default = authentication;
