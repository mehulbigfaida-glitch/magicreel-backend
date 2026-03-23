import fs from "fs";
import path from "path";

interface AnchorPersistInput {
  jobId: string;
  outputRoot: string; // outputs/{jobId}
  anchorImagePath: string;
}

export function persistAnchorImage(input: AnchorPersistInput): void {
  const { outputRoot, anchorImagePath } = input;

  const lookbookDir = path.join(outputRoot, "lookbook");
  if (!fs.existsSync(lookbookDir)) {
    fs.mkdirSync(lookbookDir, { recursive: true });
  }

  const targetPath = path.join(lookbookDir, "user.png");

  fs.copyFileSync(anchorImagePath, targetPath);
}
