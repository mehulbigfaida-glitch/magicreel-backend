import express from "express";
import { getShareData, getShareMeta } from "./share.controller";

const router = express.Router();

router.get("/:runId", getShareData);
router.get("/meta/:shareId", getShareMeta);

export default router;