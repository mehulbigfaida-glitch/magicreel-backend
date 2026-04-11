"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const user_controller_1 = require("./user.controller");
const jwt_middleware_1 = require("./jwt.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
// Protected route to get current user
router.get("/me", jwt_middleware_1.authenticate, user_controller_1.getCurrentUser);
exports.default = router;
