/* =========================================================
   MAGICREEL BATCH HARD-GARMENT LOOKBOOK RUNNER
   ========================================================= */

import axios from "axios";

const BASE_URL = "http://localhost:5001";

/* -----------------------------------------
   HARD GARMENT TEST SET
----------------------------------------- */

const HARD_GARMENTS = [
  {
    name: "Long Anarkali",
    garment: {
      frontImageUrl:
        "https://example.com/garments/anarkali_front.png",
      category: "ethnic",
    },
    presetId: "ethnic_pro",
  },
  {
    name: "Flared Kurta",
    garment: {
      frontImageUrl:
        "https://example.com/garments/flared_kurta_front.png",
      category: "ethnic",
    },
    presetId: "ethnic_pro",
  },
  {
    name: "Asymmetric Dress",
    garment: {
      frontImageUrl:
        "https://example.com/garments/asymmetric_dress_front.png",
      category: "dress",
    },
    presetId: "ecommerce_standard",
  },
];

/* -----------------------------------------
   EXECUTION PIPELINE
----------------------------------------- */

async function run() {
  for (const test of HARD_GARMENTS) {
    console.log(`\n🚀 Running lookbook for: ${test.name}`);

    // 1️⃣ Upload garment
    const garmentRes = await axios.post(
      `${BASE_URL}/garments/upload`,
      test.garment
    );

    const garmentId = garmentRes.data.garmentId;

    // 2️⃣ Base try-on
    const baseTryonRes = await axios.post(
      `${BASE_URL}/tryon/base`,
      {
        garmentId,
        modelId: "riya",
      }
    );

    const baseTryonJobId = baseTryonRes.data.jobId;

    // 3️⃣ Start lookbook
    const lookbookRes = await axios.post(
      `${BASE_URL}/lookbook/start`,
      {
        garmentId,
        modelId: "riya",
        presetId: test.presetId,
        baseTryonJobId,
      }
    );

    const lookbookId = lookbookRes.data.lookbookId;

    console.log(`📦 Lookbook started: ${lookbookId}`);

    // 4️⃣ Poll status
    let completed = false;

    while (!completed) {
      await new Promise((r) => setTimeout(r, 6000));

      const statusRes = await axios.get(
        `${BASE_URL}/lookbook/${lookbookId}/status`
      );

      const status = statusRes.data.status;

      console.log(`⏳ Status: ${status}`);

      if (
        status === "completed" ||
        status === "partial" ||
        status === "failed"
      ) {
        completed = true;
      }
    }

    // 5️⃣ Fetch results
    const resultRes = await axios.get(
      `${BASE_URL}/lookbook/${lookbookId}/results`
    );

    console.log(
      `✅ Results for ${test.name}:`,
      resultRes.data.outputs
    );
  }
}

run().catch((err) => {
  console.error("Batch run failed:", err.message);
});
