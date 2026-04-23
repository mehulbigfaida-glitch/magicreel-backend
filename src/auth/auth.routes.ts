import { Router } from "express";
import { register, login, getMe } from "./auth.controller";
import { authenticate } from "./jwt.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// ✅ Use new unified handler
router.get("/me", authenticate, getMe);

export default router;