"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroQueue = void 0;
const bullmq_1 = require("bullmq");
exports.heroQueue = new bullmq_1.Queue("heroQueue", {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    },
});
