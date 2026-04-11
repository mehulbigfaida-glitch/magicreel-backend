"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGarments = void 0;
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const fetchGarments = async (req, res) => {
    try {
        const folder = "magicreel/garments";
        const result = await cloudinary_1.default.search
            .expression(`folder:${folder}`)
            .max_results(500)
            .execute();
        const garments = result.resources.map((item) => ({
            url: item.secure_url,
            public_id: item.public_id,
            filename: item.public_id.split("/").pop(),
        }));
        return res.json({ success: true, data: garments });
    }
    catch (err) {
        console.error("❌ Garment Fetch Error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch garments",
            error: err.message
        });
    }
};
exports.fetchGarments = fetchGarments;
