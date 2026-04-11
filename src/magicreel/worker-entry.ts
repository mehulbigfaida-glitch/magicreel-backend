if (process.env.DISABLE_WORKER === "true") {
  console.log("🚫 Worker entry disabled");
  process.exit(0);
}

import "./workers/lookbookImage.worker";

console.log("🧠 Lookbook worker process started");

setInterval(() => {}, 1 << 30);
