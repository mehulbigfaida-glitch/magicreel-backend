import { Router } from "express";
import { fetchGarments } from "../controllers/garmentController";

const router = Router();

router.get("/", fetchGarments);

export default router;
