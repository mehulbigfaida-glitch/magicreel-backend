"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tryonControllerV2_1 = require("../controllers/tryonControllerV2");
const router = (0, express_1.Router)();
const controller = new tryonControllerV2_1.TryOnControllerV2();
// 🔥 V2 namespace lives HERE
router.post("/v2/run", (req, res) => controller.run(req, res));
router.get("/v2/status/:jobId", (req, res) => controller.status(req, res));
exports.default = router;
