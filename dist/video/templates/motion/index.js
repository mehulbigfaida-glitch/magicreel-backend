"use strict";
// src/video/templates/motion/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MOTION_TEMPLATE = exports.MotionTemplates = void 0;
const zoomIn_1 = require("./zoomIn");
const zoomOut_1 = require("./zoomOut");
const panLeft_1 = require("./panLeft");
const panRight_1 = require("./panRight");
const tiltUp_1 = require("./tiltUp");
const tiltDown_1 = require("./tiltDown");
exports.MotionTemplates = {
    zoomIn: zoomIn_1.zoomInTemplate,
    zoomOut: zoomOut_1.zoomOutTemplate,
    panLeft: panLeft_1.panLeftTemplate,
    panRight: panRight_1.panRightTemplate,
    tiltUp: tiltUp_1.tiltUpTemplate,
    tiltDown: tiltDown_1.tiltDownTemplate,
};
exports.DEFAULT_MOTION_TEMPLATE = "zoomIn";
