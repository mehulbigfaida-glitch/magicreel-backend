"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLookbookStatus = getLookbookStatus;
const fashn_service_1 = require("../../../magicreel/services/fashn.service");
const heroEnhance_service_1 = require("../../../magicreel/services/heroEnhance.service");
const fashnService = new fashn_service_1.FashnService();
async function getLookbookStatus(req, res) {
    try {
        const runIdsParam = req.query.runIds;
        if (!runIdsParam) {
            return res.status(400).json({
                error: "runIds query parameter is required",
            });
        }
        const runIds = runIdsParam.split(",");
        const results = {};
        for (const runId of runIds) {
            const status = await fashnService.pollStatus(runId);
            // If still running, just return status
            if (status.status !== "completed") {
                results[runId] = {
                    status: status.status,
                };
                continue;
            }
            const rawImageUrl = status.output?.[0];
            if (!rawImageUrl) {
                results[runId] = {
                    status: "failed",
                    error: "No output from FASHN",
                };
                continue;
            }
            // 🔒 Enhance the pose image
            const enhanced = await (0, heroEnhance_service_1.enhanceHeroImage)({
                jobId: runId,
                heroBaseUrl: rawImageUrl,
            });
            results[runId] = {
                status: "completed",
                outputImageUrl: enhanced.heroPreviewUrl,
            };
        }
        return res.json({
            runs: results,
        });
    }
    catch (error) {
        console.error("Lookbook status error:", error);
        return res.status(500).json({
            error: "Failed to fetch lookbook status",
        });
    }
}
