"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGE = exports.ERROR_OBJECT = void 0;
const ERROR_OBJECT = {
    DATA_NOT_FOUND: {
        statusCode: 404,
        message: "Data not found!",
    },
    WRONG_INPUT: {
        statusCode: 400,
        message: "Please check your input!",
    },
    EXISTED_DATA: {
        statusCode: 403,
        message: "Data already exists!",
    },
};
exports.ERROR_OBJECT = ERROR_OBJECT;
const ERROR_MESSAGE = {
    DATA_NOT_FOUND: "DATA_NOT_FOUND",
    WRONG_INPUT: "WRONG_INPUT",
    EXISTED_DATA: "EXISTED_DATA",
};
exports.ERROR_MESSAGE = ERROR_MESSAGE;
