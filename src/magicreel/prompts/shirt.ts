interface ShirtPromptInput {
  avatarGender: "male" | "female";
  pattern?: "striped" | "checked" | "printed" | "solid";
  tuck?: "tucked" | "untucked";
  rolledSleeves?: boolean;
}

export function buildShirtPrompt(input: ShirtPromptInput): string {
  const subject =
    input.avatarGender === "female"
      ? "young adult woman"
      : "young adult man";

  const parts: string[] = [];

  // 🔴 CONFIRMATION MARKER — DO NOT MISS THIS
  parts.push(
    `🚨 TEST CONFIRMATION 🚨 Full body studio photo of a ${subject} wearing the provided shirt, catalog-style presentation.`
  );

  parts.push(
    `Transfer only the shirt from the product image onto the model, preserving the garment’s pattern direction, scale, contrast hierarchy, and visible fabric texture so that both primary and fine details remain clear.`
  );

  if (input.pattern === "striped") {
    parts.push(
      `The shirt features linear stripe elements that should remain consistent in direction and spacing.`
    );
  }

  if (input.pattern === "checked") {
    parts.push(
      `The shirt features a regular check pattern with intersecting lines that should remain aligned and evenly spaced.`
    );
  }

  if (input.pattern === "printed") {
    parts.push(
      `The shirt features a repeating printed pattern that should remain clearly visible.`
    );
  }

  if (input.tuck === "tucked") {
    parts.push(
      `The shirt is worn neatly tucked into the trousers with a clean waistband line.`
    );
  }

  if (input.tuck === "untucked") {
    parts.push(
      `The shirt is worn untucked, with the hem fully visible.`
    );
  }

  if (input.rolledSleeves) {
    parts.push(
      `The sleeves are rolled evenly to mid-forearm.`
    );
  }

  parts.push(
    `Neutral standing pose, plain light beige studio background, soft even lighting.`
  );

  return parts.join("\n");
}
