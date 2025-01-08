"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_1 = require("./constant/error");
const errorHandler = (error, res) => {
    const errorMessage = error.message;
    let response = error_1.ERROR_OBJECT[errorMessage] || {
        statusCode: 500,
        message: errorMessage,
    };
    res.status(response.statusCode).json({ message: response.message });
};
exports.errorHandler = errorHandler;
