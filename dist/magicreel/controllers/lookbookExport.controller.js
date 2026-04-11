"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReel = void 0;
const lookbookExport_service_1 = require("../services/lookbookExport.service");
const exportReel = async (req, res) => {
    try {
        const lookbookId = req.params.lookbookId;
        const result = await (0, lookbookExport_service_1.exportLookbookReel)(lookbookId);
        res.json({
            success: true,
            result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.exportReel = exportReel;
