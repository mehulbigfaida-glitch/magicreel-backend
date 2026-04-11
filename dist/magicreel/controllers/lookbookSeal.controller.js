"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seal = void 0;
const lookbookSeal_service_1 = require("../services/lookbookSeal.service");
const seal = async (req, res) => {
    try {
        const lookbookId = req.params.lookbookId;
        const result = await (0, lookbookSeal_service_1.sealLookbook)(lookbookId);
        res.json({
            success: true,
            lookbook: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.seal = seal;
