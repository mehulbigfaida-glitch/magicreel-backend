"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const garmentController_1 = require("../controllers/garmentController");
const router = (0, express_1.Router)();
router.get("/", garmentController_1.fetchGarments);
exports.default = router;
