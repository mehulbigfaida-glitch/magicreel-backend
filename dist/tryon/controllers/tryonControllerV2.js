"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryOnControllerV2 = void 0;
const TryOnServiceV2_1 = require("../services/TryOnServiceV2");
const service = new TryOnServiceV2_1.TryOnServiceV2();
const ANCHOR_MODEL_URL = "https://res.cloudinary.com/duaqfspwa/image/upload/v1766744816/riya_Alt_Editorial_hjvxjt.png";
class TryOnControllerV2 {
    async run(req, res) {
        const { garmentImageUrl } = req.body;
        if (!garmentImageUrl) {
            return res.status(400).json({
                success: false,
                error: "garmentImageUrl is required",
            });
        }
        const { jobId } = await service.startTryOn({
            modelImageUrl: ANCHOR_MODEL_URL,
            garmentImageUrl,
        });
        return res.json({
            success: true,
            jobId,
        });
    }
    async status(req, res) {
        try {
            const job = await service.pollJob(req.params.jobId);
            return res.json({ success: true, job });
        }
        catch (e) {
            return res.status(404).json({ success: false, error: e.message });
        }
    }
}
exports.TryOnControllerV2 = TryOnControllerV2;
