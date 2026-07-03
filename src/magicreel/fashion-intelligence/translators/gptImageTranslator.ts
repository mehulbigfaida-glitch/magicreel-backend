import { CreativePlan } from "../planning/creativePlan.types";

const list = (items: string[]) =>
  items.filter(Boolean).join(", ");

const lines = (items: string[]) =>
  items.filter(Boolean).join("\n");

export function translateToGPTImagePrompt(
  plan: CreativePlan
): string {

  const prompt = `
ROLE

You are the Creative Director, Fashion Editor and Editorial Photographer for an international luxury fashion house.

MISSION

Transform the uploaded Hero image into a world-class luxury editorial campaign while preserving the uploaded Hero image as the single authoritative reference.

==================================================
NON-NEGOTIABLE PRESERVATION
==================================================

Preserve without alteration:

• Garment category
• Silhouette and proportions
• Neckline
• Sleeve construction
• Waistline
• Fabric and texture
• Embroidery, motifs and borders
• Surface detailing
• Colour palette
• Pleats and drape
• Dupatta (if present)
• Existing jewellery placement
• Garment fit
• Facial identity
• Body proportions

Only transform:
• Environment
• Architecture
• Lighting
• Editorial atmosphere
• Composition
• Camera language
• Storytelling

==================================================
CREATIVE IDENTITY
==================================================

Editorial World
${plan.background.environment}

Creative Director
${plan.identity.director}

Editorial Style
${plan.identity.editorialStyle}

Luxury Tier
${plan.identity.luxuryTier}

Objective
${plan.creativeGoal.objective}

Audience
${plan.creativeGoal.audience}

==================================================
CAMERA
==================================================

Framing: ${plan.camera.framing}
Angle: ${plan.camera.angle}
Lens: ${plan.camera.lensStyle}
Distance: ${plan.camera.distance}
Movement: ${plan.camera.movement}

==================================================
LIGHTING
==================================================

Style: ${plan.lighting.style}
Mood: ${plan.lighting.mood}
Contrast: ${plan.lighting.contrast}
Highlights: ${plan.lighting.highlights}

==================================================
COMPOSITION
==================================================

Layout: ${plan.composition.layout}
Balance: ${plan.composition.balance}
Focus: ${plan.composition.focus}
Depth: ${plan.composition.depth}

==================================================
MODEL
==================================================

Pose: ${plan.model.pose}
Expression: ${plan.model.expression}
Body Language: ${plan.model.bodyLanguage}

==================================================
EDITORIAL STYLING PHILOSOPHY
==================================================

Wardrobe Priorities
${list(plan.styling.wardrobePriority)}

Accessory Policy
${plan.styling.accessoryPolicy}

Colour Strategy
${plan.styling.colorStrategy}

==================================================
LUXURY STYLING FINISH
==================================================

After preserving the garment exactly, complete the editorial styling by applying a refined luxury styling finish.

The accessories below are part of the final editorial look and should be visibly incorporated whenever they are naturally compatible with the garment.

Apply elegant editorial styling rather than leaving the model minimally styled.

Jewellery (Required whenever visible)
${list(plan.accessories.jewellery)}

Footwear (Required whenever visible)
${list(plan.accessories.footwear)}

Hand Accessories
${list(plan.accessories.handAccessories)}

Hair Styling (Apply)
${list(plan.accessories.hairStyling)}

Beauty Styling (Apply)
${list(plan.accessories.beauty)}

Luxury Styling Rules
${lines(plan.accessories.luxuryRules)}

Strictly Avoid
${lines(plan.accessories.prohibited)}

The final image should look completely styled for an international luxury fashion campaign.

The model should never appear under-styled or missing appropriate editorial accessories.

Accessories must enhance the luxury narrative while remaining secondary to the garment.

Never cover embroidery, craftsmanship or important garment details.

Garment preservation always has the highest priority.

==================================================
EMOTION
==================================================

Tone: ${plan.emotion.emotionalTone}
Energy: ${plan.emotion.energy}

==================================================
STORY
==================================================

${plan.storytelling.narrative}

Hero Moment
${plan.storytelling.cinematicMoment}

==================================================
MANDATORY RULES
==================================================

${lines(plan.rules.required)}

==================================================
PROHIBITED
==================================================

${lines(plan.rules.prohibited)}

==================================================
QUALITY
==================================================

Deliver a Vogue-quality luxury fashion editorial with museum-grade architecture, cinematic atmosphere, natural skin rendering, ultra-realistic textiles, perfect embroidery fidelity, zero garment redesign, zero silhouette distortion and zero visual artifacts.

`.trim();

  console.log("\\n================ GPT IMAGE PROMPT ================\\n");
  console.log(prompt);
  console.log("\\n==================================================\\n");

  return prompt;
}
