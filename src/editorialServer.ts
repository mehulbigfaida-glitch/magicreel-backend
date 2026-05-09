import "dotenv/config";

import express from "express";
import cors from "cors";

import editorialRoutes from "./api/editorial/editorial.routes";

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "20mb",
  })
);

app.get(
  "/health",
  (_req, res) => {
    res.send("editorial ok");
  }
);

app.use(
  "/api/editorial",
  editorialRoutes
);

const PORT = 5050;

app.listen(PORT, () => {
  console.log(
    `🟢 Editorial server running on ${PORT}`
  );
});