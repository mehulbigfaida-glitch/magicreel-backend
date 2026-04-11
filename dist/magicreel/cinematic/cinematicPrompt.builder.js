"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCinematicPrompt = buildCinematicPrompt;
/* ------------------------------------------------------- */
function frameDirection(frame) {
    switch (frame) {
        case "entrance":
            return "Full body visible, slightly far from camera, mid-stride, natural fabric movement.";
        case "mid_walk":
            return "Full body visible, closer to camera, confident forward walk, natural arm movement, fabric subtly flowing.";
        case "upper_power":
            return "Framed from waist up, strong confident expression, spotlight emphasizing upper garment.";
        case "angle_45":
            return "Full body visible at slight 45 degree camera angle, clear garment silhouette, mid-stride motion.";
        case "detail_motion":
            return "Lower body emphasis, one foot stepping forward, fabric flowing naturally, cinematic motion feel.";
        case "final_pose":
            return "Full body centered, standing confidently at center stage, strong final pose, powerful spotlight focus.";
        default:
            return "Full body visible, confident fashion walk.";
    }
}
function environmentIntro(world) {
    if (world.theme === "runway") {
        return "Place the woman from image 1 walking forward on a luxury fashion runway.";
    }
    return `Place the woman from image 1 walking forward confidently in a ${world.architecture}.`;
}
/* ------------------------------------------------------- */
function buildCinematicPrompt(world, frame) {
    return `
${environmentIntro(world)}
${frameDirection(frame)}
${world.theme === "runway" ? `Environment is ${world.architecture}.` : ""}
${world.floor ? `The floor is ${world.floor}.` : ""}
${world.audience ? `${world.audience}.` : ""}
Lighting is ${world.lighting}.
Atmosphere contains ${world.atmosphere}.
Camera uses ${world.camera}.
Lens style is ${world.lens}.
Color grading is ${world.colorTone}.
Her body orientation and walking direction must remain consistent.
Do not modify facial features, skin tone, hairstyle, body shape, garment details, colors, or fit.
Keep her face and clothing exactly unchanged.
Professional cinematic fashion photography.
`.replace(/\s+/g, " ").trim();
}
