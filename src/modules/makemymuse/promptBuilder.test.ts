import { strict as assert } from "assert";
import { buildEightFacePrompt, buildRefinementPrompt } from "./promptBuilder";

const base = { genderPresentation: "female" as const, apparentAge: 25, skinDirection: "reference" as const };
const result = buildEightFacePrompt(base);
assert.equal(result.manifest.candidateCount, 8);
assert.equal(result.manifest.layout, "4x2");
assert.match(result.prompt, /strict 4-column by 2-row grid/);
assert.match(result.prompt, /all eight should appear approximately 25 years old/);
assert.match(result.prompt, /clearly female-presenting/);
assert.match(result.prompt, /V4 PRIORITY HIERARCHY/);\nassert.match(result.prompt, /AGE-FIRST TRANSFORMATION/);\nassert.match(result.prompt, /NATURAL SKIN REALISM/);\nassert.match(result.prompt, /naturally visible pores/);\nassert.match(result.prompt, /STRUCTURAL ARCHETYPE EXPERIMENT V4/);
assert.match(result.prompt, /at least THREE structural dimensions/);
assert.match(result.prompt, /do not add glasses/);
assert.match(result.prompt, /Candidate 1 — ADAPTIVE ANCHOR/);\nassert.match(result.prompt, /Candidate 2 — ANGULAR STRUCTURE/);\nassert.match(result.prompt, /Candidate 8 — LUXURY EDITORIAL/);

assert.match(result.prompt, /V4 COMBINED EXPERIMENT/);
assert.match(result.prompt, /AGE-FIRST and natural-skin requirements apply to every cell/);
assert.match(result.prompt, /must not appear under 18/);
assert.equal(result.promptVersion, "makemymuse-age-first-structural-archetype-experiment-v4.0.0");
assert.throws(() => buildEightFacePrompt({ ...base, apparentAge: 17 }));
assert.throws(() => buildEightFacePrompt({ ...base, apparentAge: 61 }));
assert.match(buildEightFacePrompt({ ...base, genderPresentation: "male" }).prompt, /clearly male-presenting/);
assert.match(buildEightFacePrompt({ ...base, genderPresentation: "androgynous" }).prompt, /deliberately androgynous/);
assert.match(buildRefinementPrompt({ eyes: "almond", faceShape: "heart" }), /eyes: almond; faceShape: heart/);
console.log("MakeMyMuse prompt builder tests passed.");
