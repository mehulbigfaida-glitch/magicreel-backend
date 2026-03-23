// src/services/editorial/engines/layoutEngine.ts
import sharp from "sharp";
import { createSVGText, createParagraphSVG } from "./typographyEngine";
import { applyVignette, applyGrain } from "./filtersEngine";

export const PAGE_WIDTH = 2480;
export const PAGE_HEIGHT = 3508;

/* ------------------------------------------------------------
   UTILITY — FETCH IMAGE FROM URL
------------------------------------------------------------- */
async function fetchImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  const arrBuf = await res.arrayBuffer();
  return Buffer.from(arrBuf);
}

/* Small helper to avoid crashes when template parts are missing */
function get<T>(value: T | undefined | null, fallback: T): T {
  return value === undefined || value === null ? fallback : value;
}

/* ------------------------------------------------------------
   PAGE 1 — VOGUE COVER
------------------------------------------------------------- */
export async function renderVogueCover(
  modelUrl: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 1 — Vogue Cover");

  const bgImage = await sharp(await fetchImage(modelUrl))
    .resize(PAGE_WIDTH, PAGE_HEIGHT, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  let composed = bgImage;

  // Title (optional)
  if (template?.title) {
    const title = template.title;
    const svg = createSVGText({
      text: title.text ?? "",
      fontSize: get(title.fontSize, 260),
      color: get(title.color, "#ffffff"),
      fontFamily: get(title.fontFamily, "Bodoni Moda"),
      fontWeight: get(title.fontWeight, "bold"),
      letterSpacing: get(title.tracking, -10),
      width: PAGE_WIDTH,
      height: 400,
    });

    const top = get(title.position?.y, 250);
    composed = await sharp(composed)
      .composite([{ input: svg, top, left: 0 }])
      .toBuffer();
  }

  // Subtitle (optional)
  if (template?.subtitle) {
    const sub = template.subtitle;
    const svg = createSVGText({
      text: sub.text ?? "",
      fontSize: get(sub.fontSize, 72),
      color: get(sub.color, "#e8e8e8"),
      fontFamily: get(sub.fontFamily, "Cormorant Garamond"),
      fontWeight: get(sub.fontWeight, "regular"),
      letterSpacing: get(sub.tracking, 0),
      width: PAGE_WIDTH,
      height: 300,
    });

    const top = get(sub.position?.y, 3300);
    composed = await sharp(composed)
      .composite([{ input: svg, top, left: 0 }])
      .toBuffer();
  }

  // Filters
  composed = await applyVignette(composed, PAGE_WIDTH, PAGE_HEIGHT);
  composed = await applyGrain(composed);

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 1 Rendered");
}

/* ------------------------------------------------------------
   PAGE 2 — EDITORIAL STORY (FIXED)
------------------------------------------------------------- */
export async function renderVogueEditorialPage(
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 2 — Editorial Story (FIXED)");

  // Create blank page
  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: template.background.color || "#ffffff",
    },
  })
    .png()
    .toBuffer();

  /* ------------------------------------------
     TITLE (safe SVG, auto-sized)
  ------------------------------------------- */
  const titleSVG = createSVGText({
    text: template.title.text,
    fontSize: template.title.fontSize,
    color: template.title.color,
    fontFamily: template.title.fontFamily,
    fontWeight: template.title.fontWeight,
    letterSpacing: template.title.tracking,
    width: PAGE_WIDTH,
    height: 300, // SAFE fixed height
  });

  composed = await sharp(composed)
    .composite([
      {
        input: titleSVG,
        top: template.title.position.y,
        left: 0,
      },
    ])
    .toBuffer();

  /* ------------------------------------------
     SUBTITLE
  ------------------------------------------- */
  const subtitleSVG = createSVGText({
    text: template.subtitle.text,
    fontSize: template.subtitle.fontSize,
    color: template.subtitle.color,
    fontFamily: template.subtitle.fontFamily,
    width: PAGE_WIDTH,
    height: 200,
  });

  composed = await sharp(composed)
    .composite([
      {
        input: subtitleSVG,
        top: template.subtitle.position.y,
        left: 0,
      },
    ])
    .toBuffer();

  /* ------------------------------------------
     PARAGRAPH (CRITICAL FIX)
     — we generate a SAFE height SVG
     — maxHeight is limited to 1200px
  ------------------------------------------- */
  const paragraphSVG = createParagraphSVG({
    text: template.paragraph.text,
    fontSize: template.paragraph.fontSize,
    color: template.paragraph.color,
    fontFamily: template.paragraph.fontFamily,
    lineHeight: template.paragraph.lineHeight,
    maxWidth: template.paragraph.maxWidth,
    pageWidth: PAGE_WIDTH,
    maxHeight: 1200, 
  });

  composed = await sharp(composed)
    .composite([
      {
        input: paragraphSVG,
        top: template.paragraph.position.y,
        left: (PAGE_WIDTH - template.paragraph.maxWidth) / 2,
      },
    ])
    .toBuffer();

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 2 Rendered (with FIXED SVG sizes)");
}

/* ------------------------------------------------------------
   PAGE 3 — DOUBLE PORTRAIT
------------------------------------------------------------- */
export async function renderVogueDoublePortrait(
  leftUrl: string,
  rightUrl: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 3 — Double Portrait");

  const bgColor = get(template?.background?.color, "#ffffff");
  const leftSpec = get(template?.leftImage, {
    width: 1100,
    height: 3000,
    x: 180,
    y: 250,
    fit: "cover",
    gravity: "center",
  });
  const rightSpec = get(template?.rightImage, {
    width: 1000,
    height: 2500,
    x: 1300,
    y: 450,
    fit: "cover",
    gravity: "center",
  });

  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: bgColor,
    },
  })
    .png()
    .toBuffer();

  // Left image
  const leftIMG = await sharp(await fetchImage(leftUrl))
    .resize(leftSpec.width, leftSpec.height, {
      fit: leftSpec.fit ?? "cover",
      position: leftSpec.gravity ?? "center",
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  composed = await sharp(composed)
    .composite([
      {
        input: leftIMG,
        top: leftSpec.y ?? 0,
        left: leftSpec.x ?? 0,
      },
    ])
    .toBuffer();

  // Right image
  const rightIMG = await sharp(await fetchImage(rightUrl))
    .resize(rightSpec.width, rightSpec.height, {
      fit: rightSpec.fit ?? "cover",
      position: rightSpec.gravity ?? "center",
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  composed = await sharp(composed)
    .composite([
      {
        input: rightIMG,
        top: rightSpec.y ?? 0,
        left: rightSpec.x ?? 0,
      },
    ])
    .toBuffer();

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 3 Rendered");
}

/* ------------------------------------------------------------
   PAGE 4 — FULL BLEED MINIMAL
------------------------------------------------------------- */
export async function renderVogueFullBleed(
  imageUrl: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 4 — Full Bleed Minimal");

  const imageSpec = get(template?.image, {
    fit: "cover",
    gravity: "center",
  });

  const img = await sharp(await fetchImage(imageUrl))
    .resize(PAGE_WIDTH, PAGE_HEIGHT, {
      fit: imageSpec.fit ?? "cover",
      position: imageSpec.gravity ?? "center",
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  await sharp(img).png().toFile(outputPath);
  console.log("✔ Page 4 Rendered");
}

/* ------------------------------------------------------------
   PAGE 5 — PRODUCT HIGHLIGHT
------------------------------------------------------------- */
export async function renderVogueProductHighlight(
  productUrl: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 5 — Product Highlight");

  const bgColor = get(template?.background?.color, "#ffffff");
  const product = get(template?.product, {
    width: 1600,
    height: 2000,
    fit: "contain",
    gravity: "center",
    position: { y: 530 },
  });

  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: bgColor,
    },
  })
    .png()
    .toBuffer();

  const productIMG = await sharp(await fetchImage(productUrl))
    .resize(product.width, product.height, {
      fit: product.fit ?? "contain",
      position: product.gravity ?? "center",
    })
    .png()
    .toBuffer();

  const productTop = product.position?.y ?? 530;
  const productLeft = (PAGE_WIDTH - product.width) / 2;

  composed = await sharp(composed)
    .composite([
      {
        input: productIMG,
        top: productTop,
        left: productLeft,
      },
    ])
    .toBuffer();

  // Title (optional)
  if (template?.title) {
    const t = template.title;
    const titleSVG = createSVGText({
      text: t.text ?? "",
      fontSize: get(t.fontSize, 140),
      color: get(t.color, "#000000"),
      fontFamily: get(t.fontFamily, "Bodoni Moda"),
      fontWeight: get(t.fontWeight, "bold"),
      letterSpacing: get(t.tracking, 2),
      width: PAGE_WIDTH,
      height: 300,
    });
    const top = get(t.position?.y, 230);

    composed = await sharp(composed)
      .composite([{ input: titleSVG, top, left: 0 }])
      .toBuffer();
  }

  // Description (optional)
  if (template?.description) {
    const d = template.description;
    const maxWidth = get(d.maxWidth, 1500);
    const descSVG = createParagraphSVG({
      text: d.text ?? "",
      fontSize: get(d.fontSize, 52),
      color: get(d.color, "#444444"),
      fontFamily: get(d.fontFamily, "Cormorant Garamond"),
      lineHeight: get(d.lineHeight, 1.35),
      maxWidth,
      pageWidth: PAGE_WIDTH,
    });

    const top = get(d.position?.y, 2900);
    const left = (PAGE_WIDTH - maxWidth) / 2;

    composed = await sharp(composed)
      .composite([{ input: descSVG, top, left }])
      .toBuffer();
  }

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 5 Rendered");
}

/* ------------------------------------------------------------
   PAGE 6 — COUTURE BLACK & GOLD
------------------------------------------------------------- */
export async function renderVogueCoutureGold(
  productUrl: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 6 — Couture Black + Gold");

  const bgColor = get(template?.background?.color, "#000000");
  const product = get(template?.product, {
    width: 1500,
    height: 2600,
    fit: "contain",
    gravity: "center",
    position: { y: 450 },
  });

  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: bgColor,
    },
  })
    .png()
    .toBuffer();

  const productIMG = await sharp(await fetchImage(productUrl))
    .resize(product.width, product.height, {
      fit: product.fit ?? "contain",
      position: product.gravity ?? "center",
    })
    .png()
    .toBuffer();

  const productTop = product.position?.y ?? 450;
  const productLeft = (PAGE_WIDTH - product.width) / 2;

  composed = await sharp(composed)
    .composite([
      {
        input: productIMG,
        top: productTop,
        left: productLeft,
      },
    ])
    .toBuffer();

  // Title (optional)
  if (template?.title) {
    const t = template.title;
    const titleSVG = createSVGText({
      text: t.text ?? "",
      fontSize: get(t.fontSize, 180),
      color: get(t.color, "#d4af37"),
      fontFamily: get(t.fontFamily, "Bodoni Moda"),
      fontWeight: get(t.fontWeight, "bold"),
      letterSpacing: get(t.tracking, 4),
      width: PAGE_WIDTH,
      height: 300,
    });

    const top = get(t.position?.y, 240);
    composed = await sharp(composed)
      .composite([{ input: titleSVG, top, left: 0 }])
      .toBuffer();
  }

  // Subtitle (optional)
  if (template?.subtitle) {
    const s = template.subtitle;
    const subtitleSVG = createSVGText({
      text: s.text ?? "",
      fontSize: get(s.fontSize, 70),
      color: get(s.color, "#e6c56c"),
      fontFamily: get(s.fontFamily, "Cormorant Garamond"),
      fontWeight: get(s.fontWeight, "regular"),
      letterSpacing: get(s.tracking, 2),
      width: PAGE_WIDTH,
      height: 200,
    });

    const top = get(s.position?.y, 350);
    composed = await sharp(composed)
      .composite([{ input: subtitleSVG, top, left: 0 }])
      .toBuffer();
  }

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 6 Rendered");
}

/* ------------------------------------------------------------
   PAGE 7 — PRADA GEOMETRY SPLIT
------------------------------------------------------------- */
export async function renderVoguePradaSplit(
  leftUrl: string,
  rightUrl: string,
  bottomUrl: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 7 — Prada Geometry Split");

  const bgColor = get(template?.background?.color, "#ffffff");
  const leftSpec = get(template?.leftImage, {
    width: 1300,
    height: 3508,
    x: 0,
    y: 0,
    fit: "cover",
    gravity: "center",
  });
  const rightSpec = get(template?.rightImage, {
    width: 1180,
    height: 1750,
    x: 1300,
    y: 0,
    fit: "cover",
    gravity: "center",
  });
  const bottomSpec = get(template?.bottomImage, {
    width: 1180,
    height: 1758,
    x: 1300,
    y: 1750,
    fit: "cover",
    gravity: "center",
  });

  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: bgColor,
    },
  })
    .png()
    .toBuffer();

  const leftIMG = await sharp(await fetchImage(leftUrl))
    .resize(leftSpec.width, leftSpec.height, {
      fit: leftSpec.fit ?? "cover",
      position: leftSpec.gravity ?? "center",
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  composed = await sharp(composed)
    .composite([
      {
        input: leftIMG,
        top: leftSpec.y ?? 0,
        left: leftSpec.x ?? 0,
      },
    ])
    .toBuffer();

  const rightIMG = await sharp(await fetchImage(rightUrl))
    .resize(rightSpec.width, rightSpec.height, {
      fit: rightSpec.fit ?? "cover",
      position: rightSpec.gravity ?? "center",
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  composed = await sharp(composed)
    .composite([
      {
        input: rightIMG,
        top: rightSpec.y ?? 0,
        left: rightSpec.x ?? 0,
      },
    ])
    .toBuffer();

  const bottomIMG = await sharp(await fetchImage(bottomUrl))
    .resize(bottomSpec.width, bottomSpec.height, {
      fit: bottomSpec.fit ?? "cover",
      position: bottomSpec.gravity ?? "center",
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  composed = await sharp(composed)
    .composite([
      {
        input: bottomIMG,
        top: bottomSpec.y ?? 0,
        left: bottomSpec.x ?? 0,
      },
    ])
    .toBuffer();

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 7 Rendered");
}

/* ------------------------------------------------------------
   PAGE 8 — MOODBOARD
------------------------------------------------------------- */
export async function renderVogueMoodboard(
  img1Url: string,
  img2Url: string,
  img3Url: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 8 — Moodboard");

  const bgColor = get(template?.background?.color, "#faf8f6");
  const imageSpecs = get(template?.images, [
    {
      width: 1500,
      height: 1800,
      x: 140,
      y: 300,
      fit: "cover",
      gravity: "center",
    },
    {
      width: 1100,
      height: 1400,
      x: 1240,
      y: 350,
      fit: "cover",
      gravity: "center",
    },
    {
      width: 1100,
      height: 1400,
      x: 1240,
      y: 1800,
      fit: "cover",
      gravity: "center",
    },
  ]);

  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: bgColor,
    },
  })
    .png()
    .toBuffer();

  const urls = [img1Url, img2Url, img3Url];

  for (let i = 0; i < imageSpecs.length && i < urls.length; i++) {
    const spec = imageSpecs[i];
    const block = await sharp(await fetchImage(urls[i]))
      .resize(spec.width, spec.height, {
        fit: spec.fit ?? "cover",
        position: spec.gravity ?? "center",
      })
      .jpeg({ quality: 95 })
      .toBuffer();

    composed = await sharp(composed)
      .composite([{ input: block, top: spec.y ?? 0, left: spec.x ?? 0 }])
      .toBuffer();
  }

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 8 Rendered");
}

/* ------------------------------------------------------------
   PAGE 9 — LIFESTYLE CINEMATIC
------------------------------------------------------------- */
export async function renderVogueLifestyle(
  imageUrl: string,
  outputPath: string,
  template: any,
) {
  console.log("🎨 Rendering Page 9 — Lifestyle Cinematic Spread");

  const bgColor = get(template?.background?.color, "#ffffff");
  const imageSpec = get(template?.image, {
    width: 2480,
    height: 2000,
    x: 0,
    y: 650,
    fit: "cover",
    gravity: "center",
  });

  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: bgColor,
    },
  })
    .png()
    .toBuffer();

  const mainIMG = await sharp(await fetchImage(imageUrl))
    .resize(imageSpec.width, imageSpec.height, {
      fit: imageSpec.fit ?? "cover",
      position: imageSpec.gravity ?? "center",
    })
    .jpeg({ quality: 96 })
    .toBuffer();

  composed = await sharp(composed)
    .composite([
      {
        input: mainIMG,
        top: imageSpec.y ?? 0,
        left: imageSpec.x ?? 0,
      },
    ])
    .toBuffer();

  // Title (optional)
  if (template?.title) {
    const t = template.title;
    const titleSVG = createSVGText({
      text: t.text ?? "",
      fontSize: get(t.fontSize, 130),
      color: get(t.color, "#000000"),
      fontFamily: get(t.fontFamily, "Cormorant Garamond"),
      fontWeight: get(t.fontWeight, "bold"),
      letterSpacing: get(t.tracking, 2),
      width: PAGE_WIDTH,
      height: 250,
    });

    const top = get(t.position?.y, 250);
    composed = await sharp(composed)
      .composite([{ input: titleSVG, top, left: 0 }])
      .toBuffer();
  }

  // Subtitle (optional)
  if (template?.subtitle) {
    const s = template.subtitle;
    const subtitleSVG = createSVGText({
      text: s.text ?? "",
      fontSize: get(s.fontSize, 60),
      color: get(s.color, "#555555"),
      fontFamily: get(s.fontFamily, "Cormorant Garamond"),
      fontWeight: get(s.fontWeight, "regular"),
      letterSpacing: get(s.tracking, 1),
      width: PAGE_WIDTH,
      height: 200,
    });

    const top = get(s.position?.y, 390);
    composed = await sharp(composed)
      .composite([{ input: subtitleSVG, top, left: 0 }])
      .toBuffer();
  }

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 9 Rendered");
}

/* ------------------------------------------------------------
   PAGE 10 — ULTRA MINIMAL BACK COVER
------------------------------------------------------------- */
export async function renderVogueBackCover(outputPath: string, template: any) {
  console.log("🎨 Rendering Page 10 — Back Cover");

  const bgColor = get(template?.background?.color, "#000000");

  let composed = await sharp({
    create: {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      channels: 3,
      background: bgColor,
    },
  })
    .png()
    .toBuffer();

  if (template?.logo) {
    const l = template.logo;
    const logoSVG = createSVGText({
      text: l.text ?? "MAGICREEL",
      fontSize: get(l.fontSize, 180),
      color: get(l.color, "#ffffff"),
      fontFamily: get(l.fontFamily, "Bodoni Moda"),
      fontWeight: get(l.fontWeight, "bold"),
      letterSpacing: get(l.tracking, 8),
      width: PAGE_WIDTH,
      height: 400,
    });

    const top = get(l.position?.y, 1300);
    composed = await sharp(composed)
      .composite([{ input: logoSVG, top, left: 0 }])
      .toBuffer();
  }

  if (template?.tagline) {
    const t = template.tagline;
    const taglineSVG = createSVGText({
      text: t.text ?? "THE FUTURE OF FASHION IMAGING",
      fontSize: get(t.fontSize, 48),
      color: get(t.color, "#cccccc"),
      fontFamily: get(t.fontFamily, "Cormorant Garamond"),
      fontWeight: get(t.fontWeight, "regular"),
      letterSpacing: get(t.tracking, 2),
      width: PAGE_WIDTH,
      height: 200,
    });

    const top = get(t.position?.y, 3000);
    composed = await sharp(composed)
      .composite([{ input: taglineSVG, top, left: 0 }])
      .toBuffer();
  }

  await sharp(composed).png().toFile(outputPath);
  console.log("✔ Page 10 Rendered — Back Cover Complete");
}
