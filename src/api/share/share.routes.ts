import express from "express";
import { getShareData } from "./share.controller";

const router = express.Router();

// PUBLIC route (no auth)
router.get("/:runId", getShareData);

export default router;