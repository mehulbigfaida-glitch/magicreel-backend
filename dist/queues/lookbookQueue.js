"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookbookImageQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const REDIS_URL = "redis://127.0.0.1:6379";
exports.lookbookImageQueue = new bull_1.default("lookbook-image-queue", REDIS_URL);
