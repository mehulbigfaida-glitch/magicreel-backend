import { Router } from "express";
import { getShareAsset } from "./get-share";
import { createShareAsset } from "./create-share";

const router = Router();

router.get("/:id", getShareAsset);
router.post("/", createShareAsset); // ✅ ADD THIS

export default router;