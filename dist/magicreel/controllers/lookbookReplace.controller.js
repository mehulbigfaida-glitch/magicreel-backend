"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceElement = void 0;
const lookbookReplace_service_1 = require("../services/lookbookReplace.service");
const replaceElement = async (req, res) => {
    try {
        const result = await (0, lookbookReplace_service_1.replaceLookbookElement)({
            lookbookId: req.params.lookbookId,
            elementType: req.body.elementType,
            elementImageUrl: req.body.elementImageUrl,
        });
        res.json({
            success: true,
            edit: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.replaceElement = replaceElement;
