"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tryonController_1 = require("../controllers/tryonController");
const router = (0, express_1.Router)();
router.post("/", tryonController_1.generateTryOn);
exports.default = router;
