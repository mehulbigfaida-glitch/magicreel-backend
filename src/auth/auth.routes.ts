import { Router } from "express";
import { register, login } from "./auth.controller";
import { getCurrentUser } from "./user.controller";
import { authenticate } from "./jwt.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected route to get current user
router.get("/me", authenticate, getCurrentUser);

export default router;