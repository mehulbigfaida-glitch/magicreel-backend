"use strict";
// src/video/templates/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MOTION_TEMPLATE = exports.MotionTemplates = exports.parallaxVerticalTemplate = exports.parallaxHorizontalTemplate = exports.shakeTemplate = exports.rotateRightTemplate = exports.rotateLeftTemplate = exports.slideDiagonalDownTemplate = exports.slideDiagonalUpTemplate = exports.tiltDownTemplate = exports.tiltUpTemplate = exports.panRightTemplate = exports.panLeftTemplate = exports.zoomOutTemplate = exports.zoomInTemplate = void 0;
// Re-export individual motion templates from the motion folder
var zoomIn_1 = require("./motion/zoomIn");
Object.defineProperty(exports, "zoomInTemplate", { enumerable: true, get: function () { return zoomIn_1.zoomInTemplate; } });
var zoomOut_1 = require("./motion/zoomOut");
Object.defineProperty(exports, "zoomOutTemplate", { enumerable: true, get: function () { return zoomOut_1.zoomOutTemplate; } });
var panLeft_1 = require("./motion/panLeft");
Object.defineProperty(exports, "panLeftTemplate", { enumerable: true, get: function () { return panLeft_1.panLeftTemplate; } });
var panRight_1 = require("./motion/panRight");
Object.defineProperty(exports, "panRightTemplate", { enumerable: true, get: function () { return panRight_1.panRightTemplate; } });
var tiltUp_1 = require("./motion/tiltUp");
Object.defineProperty(exports, "tiltUpTemplate", { enumerable: true, get: function () { return tiltUp_1.tiltUpTemplate; } });
var tiltDown_1 = require("./motion/tiltDown");
Object.defineProperty(exports, "tiltDownTemplate", { enumerable: true, get: function () { return tiltDown_1.tiltDownTemplate; } });
var slideDiagonalUp_1 = require("./motion/slideDiagonalUp");
Object.defineProperty(exports, "slideDiagonalUpTemplate", { enumerable: true, get: function () { return slideDiagonalUp_1.slideDiagonalUpTemplate; } });
var slideDiagonalDown_1 = require("./motion/slideDiagonalDown");
Object.defineProperty(exports, "slideDiagonalDownTemplate", { enumerable: true, get: function () { return slideDiagonalDown_1.slideDiagonalDownTemplate; } });
var rotateLeft_1 = require("./motion/rotateLeft");
Object.defineProperty(exports, "rotateLeftTemplate", { enumerable: true, get: function () { return rotateLeft_1.rotateLeftTemplate; } });
var rotateRight_1 = require("./motion/rotateRight");
Object.defineProperty(exports, "rotateRightTemplate", { enumerable: true, get: function () { return rotateRight_1.rotateRightTemplate; } });
var shake_1 = require("./motion/shake");
Object.defineProperty(exports, "shakeTemplate", { enumerable: true, get: function () { return shake_1.shakeTemplate; } });
var parallaxHorizontal_1 = require("./motion/parallaxHorizontal");
Object.defineProperty(exports, "parallaxHorizontalTemplate", { enumerable: true, get: function () { return parallaxHorizontal_1.parallaxHorizontalTemplate; } });
var parallaxVertical_1 = require("./motion/parallaxVertical");
Object.defineProperty(exports, "parallaxVerticalTemplate", { enumerable: true, get: function () { return parallaxVertical_1.parallaxVerticalTemplate; } });
// Also re-export the MotionTemplates map and default from motion/index
var motion_1 = require("./motion");
Object.defineProperty(exports, "MotionTemplates", { enumerable: true, get: function () { return motion_1.MotionTemplates; } });
Object.defineProperty(exports, "DEFAULT_MOTION_TEMPLATE", { enumerable: true, get: function () { return motion_1.DEFAULT_MOTION_TEMPLATE; } });
