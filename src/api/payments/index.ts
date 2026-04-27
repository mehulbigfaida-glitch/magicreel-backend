import express from "express";
import { getPaymentHistory } from "./history";

const router = express.Router();

router.get("/history", getPaymentHistory);

export default router;