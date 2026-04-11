"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseAngleService = void 0;
const axios_1 = __importDefault(require("axios"));
const cloudinary_service_1 = require("./cloudinary.service");
class PoseAngleService {
    constructor() {
        this.token = process.env.REPLICATE_API_TOKEN || "";
        if (!this.token) {
            console.warn("⚠️ REPLICATE_API_TOKEN missing - poseAngle disabled");
        }
    }
    /* ----------------------------------
       CAMERA PARAMETER MAP
    ---------------------------------- */
    getCameraParams(type) {
        switch (type) {
            case "hero_45":
                return {
                    rotate_degrees: 35,
                    vertical_tilt: 0,
                    move_forward: 0,
                    use_wide_angle: false,
                };
            case "hero_45_opposite":
                return {
                    rotate_degrees: -35,
                    vertical_tilt: 0,
                    move_forward: 0,
                    use_wide_angle: false,
                };
            case "walking":
                return {
                    rotate_degrees: 15,
                    vertical_tilt: 0,
                    move_forward: 0.3,
                    use_wide_angle: false,
                };
            case "detail":
                return {
                    rotate_degrees: 0,
                    vertical_tilt: 0,
                    move_forward: 1.8,
                    use_wide_angle: false,
                };
        }
    }
    /* ----------------------------------
       POSE PROMPT MAP
    ---------------------------------- */
    getPosePrompt(type) {
        switch (type) {
            case "hero_45":
                return "The model slightly rotates the body about 45 degrees while maintaining a natural fashion posture. The garment remains exactly the same as the input image.";
            case "hero_45_opposite":
                return "The model rotates about 45 degrees to the opposite side creating a balanced fashion catalog angle while maintaining the same garment structure.";
            case "walking":
                return "The model is captured mid-stride walking naturally as in a fashion runway shot. One leg is stepping forward while the other trails behind. The opposite arm swings naturally. The body shows a natural weight shift with slight torso rotation creating a dynamic fashion catalog walking pose. The garment structure, sleeves, waistline and fabric folds remain identical to the input image.";
            case "detail":
                return "The camera moves closer to capture a chest-level detail shot focusing on collar, chest area, buttons and fabric texture while keeping the garment unchanged.";
        }
    }
    /* ----------------------------------
       MULTI-ANGLE POSE GENERATION
    ---------------------------------- */
    async generatePose(imageUrl, options) {
        try {
            const camera = this.getCameraParams(options.type);
            const posePrompt = this.getPosePrompt(options.type);
            const input = {
                image: imageUrl,
                rotate_degrees: camera.rotate_degrees,
                vertical_tilt: camera.vertical_tilt,
                move_forward: camera.move_forward,
                use_wide_angle: camera.use_wide_angle,
                prompt: "Preserve the exact model identity, outfit, garment structure, sleeve length, neckline, waistline and clothing proportions from the input image. Do not modify the garment design, fabric texture, folds or styling. Only adjust camera angle and natural fashion posture while keeping the garment appearance identical. " +
                    posePrompt,
                go_fast: false,
                aspect_ratio: "match_input_image",
                output_format: "png",
                output_quality: 95,
                true_guidance_scale: 1.1,
                use_multiple_angles: true,
                multiple_angles_strength: 1.05,
                lora_weights: "dx8152/Qwen-Edit-2509-Multiple-angles",
                seed: 42,
            };
            const startRes = await axios_1.default.post("https://api.replicate.com/v1/models/qwen/qwen-edit-multiangle/predictions", { input }, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                },
                transformRequest: [(data, headers) => {
                        if (headers) {
                            headers.Authorization = "REDACTED";
                        }
                        return JSON.stringify(data);
                    }],
            });
            const predictionUrl = startRes.data.urls.get;
            const startTime = Date.now();
            while (true) {
                if (Date.now() - startTime > 90000) {
                    console.warn("Pose generation timeout");
                    return imageUrl;
                }
                const poll = await axios_1.default.get(predictionUrl, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });
                const status = poll.data.status;
                if (status === "succeeded") {
                    const replicateUrl = poll.data.output[0];
                    const imageRes = await axios_1.default.get(replicateUrl, {
                        responseType: "arraybuffer",
                    });
                    const buffer = Buffer.from(imageRes.data);
                    const uploaded = await (0, cloudinary_service_1.uploadBufferToCloudinary)(buffer);
                    return uploaded.secure_url;
                }
                if (status === "failed") {
                    console.warn("Pose generation failed");
                    return imageUrl;
                }
                await new Promise((r) => setTimeout(r, 1500));
            }
        }
        catch (err) {
            console.error(`Pose ${options.type} error:`, {
                message: err?.message,
                status: err?.response?.status,
            });
            return imageUrl;
        }
    }
}
exports.PoseAngleService = PoseAngleService;
