"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lookbook_controller_1 = require("../controllers/lookbook.controller");
const router = (0, express_1.Router)();
router.post("/hero/generate", lookbook_controller_1.generateHeroImage);
exports.default = router;
