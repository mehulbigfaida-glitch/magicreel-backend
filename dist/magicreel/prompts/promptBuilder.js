"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildP2MPrompt = buildP2MPrompt;
const promptRegistryV1_1 = require("./promptRegistryV1");
function buildP2MPrompt({ category, styling }) {
    const scenePrompt = promptRegistryV1_1.PROMPT_REGISTRY_V1[category];
    if (!scenePrompt) {
        throw new Error(`Unknown category: ${category}`);
    }
    /* =========================
       STYLING BLOCK
    ========================= */
    let stylingBlock = "";
    if (styling) {
        const s = styling.toUpperCase();
        switch (s) {
            case "TUCKED":
                stylingBlock =
                    "The shirt is fully tucked-in inside the trousers with a clean waistline. The waistband of the trousers is clearly visible with a belt worn. The shirt hem remains completely inside the trousers.";
                break;
            case "UNTUCKED":
                stylingBlock =
                    "The shirt is worn untucked outside the trousers.";
                break;
            case "OPEN":
                stylingBlock =
                    "The jacket is worn open.";
                break;
            case "BUTTONED":
                stylingBlock =
                    "The jacket is fully buttoned.";
                break;
            case "CASUAL":
                stylingBlock =
                    "The outfit is styled casually.";
                break;
            case "FORMAL":
                stylingBlock =
                    "The outfit is styled formally.";
                break;
            case "PLAIN_SET":
                stylingBlock =
                    "Traditional kurta set styling.";
                break;
            case "WITH_BUNDI":
                stylingBlock =
                    "Kurta set styled with a traditional bundi jacket.";
                break;
            case "CLASSIC":
                stylingBlock =
                    "Styled traditionally with churidar and mojri footwear.";
                break;
            case "INDO_WESTERN":
                stylingBlock =
                    "Styled in an indo-western manner with tailored trousers.";
                break;
            case "SHORTS":
                stylingBlock =
                    "Short length bottom garment ending above the knee.";
                break;
            case "CROPPED":
                stylingBlock =
                    "Cropped length bottom garment ending above the ankle.";
                break;
            case "FULL_LENGTH":
                stylingBlock =
                    "Full length bottom garment reaching the ankle.";
                break;
        }
    }
    /* =========================
       GARMENT FIDELITY LOCK
    ========================= */
    const garmentFidelityLock = "Preserve the exact garment structure, fabric texture, stitching details, sleeve length, neckline shape and overall fit exactly as shown in the input garment image.";
    /* =========================
       FINAL PROMPT (NO FRAMING)
    ========================= */
    let prompt = scenePrompt;
    if (stylingBlock) {
        prompt += " " + stylingBlock;
    }
    prompt += " " + garmentFidelityLock;
    /* =========================
       FORCE SINGLE LINE (FASHN SAFE)
    ========================= */
    prompt = prompt.replace(/\s+/g, " ").trim();
    return prompt;
}
