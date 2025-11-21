"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (msg, ...args) => {
        console.log(`[INFO] ${msg}`, ...args);
    },
    error: (msg, ...args) => {
        console.error(`[ERROR] ${msg}`, ...args);
    }
};

