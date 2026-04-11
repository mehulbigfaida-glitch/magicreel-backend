"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSVGText = createSVGText;
exports.createParagraphSVG = createParagraphSVG;
const word_wrap_1 = __importDefault(require("word-wrap"));
function createSVGText({ text, fontSize, color = "#000000", fontFamily = "Bodoni Moda", width = 2480, height = 400, fontWeight = "bold", letterSpacing = 0, }) {
    const safe = escapeXML(text);
    const h = Math.min(height, 3508);
    return Buffer.from(`
<svg width="${width}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text {
      font-family: '${fontFamily}', sans-serif;
      fill: ${color};
      font-size: ${fontSize}px;
      font-weight: ${fontWeight};
      letter-spacing: ${letterSpacing}px;
    }
  </style>

  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">
    ${safe}
  </text>
</svg>
`);
}
function createParagraphSVG({ text, fontSize = 40, color = "#000", fontFamily = "Cormorant Garamond", lineHeight = 56, maxWidth = 1600, maxHeight = 1200, pageWidth = 2480, }) {
    const safe = escapeXML(text);
    // Hard wrapping
    const wrapped = (0, word_wrap_1.default)(safe, { width: 40 });
    // Calculate how tall the block will be
    let lines = wrapped.split("\n");
    let svgHeight = lines.length * lineHeight;
    // LIMIT height to avoid Sharp crash
    svgHeight = Math.min(svgHeight, maxHeight);
    const svg = `
<svg width="${maxWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    tspan {
      font-family: '${fontFamily}';
      fill: ${color};
      font-size: ${fontSize}px;
    }
  </style>

  <text x="0" y="${fontSize}">
    ${lines
        .map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : lineHeight}">${escapeXML(line)}</tspan>`)
        .join("")}
  </text>
</svg>`;
    return Buffer.from(svg);
}
function escapeXML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
