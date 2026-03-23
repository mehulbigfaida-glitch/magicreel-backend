// src/tryon/controllers/tryonStatusController.ts
import { Request, Response } from "express";
import axios from "axios";

const FASHN_BASE_URL = "https://api.fashn.ai/v1";
const API_KEY = process.env.FASHN_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ FASHN_API_KEY is not set. Try-On status will fail until it is configured.");
}

/**
 * GET /api/tryon-status/:id
 * Proxies to Fashn /status/<id>
 */
export const getTryOnStatus = async (req: Request, res: Response) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        error: "FASHN_API_KEY is not configured on the server.",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing prediction id in URL.",
      });
    }

    const response = await axios.get(`${FASHN_BASE_URL}/status/${id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("📡 Fashn /status response →", response.data);

    return res.json(response.data);
  } catch (err: any) {
    const status = err.response?.status || 500;
    const details = err.response?.data || err.message;

    console.error("❌ Fashn /status error:", status, details);

    return res.status(status).json({
      success: false,
      error: details,
    });
  }
};
