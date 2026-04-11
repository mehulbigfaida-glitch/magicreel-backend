"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistAnchorImage = persistAnchorImage;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function persistAnchorImage(input) {
    const { outputRoot, anchorImagePath } = input;
    const lookbookDir = path_1.default.join(outputRoot, "lookbook");
    if (!fs_1.default.existsSync(lookbookDir)) {
        fs_1.default.mkdirSync(lookbookDir, { recursive: true });
    }
    const targetPath = path_1.default.join(lookbookDir, "user.png");
    fs_1.default.copyFileSync(anchorImagePath, targetPath);
}
