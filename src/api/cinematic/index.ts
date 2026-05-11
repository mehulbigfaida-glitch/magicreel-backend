import { Router } from "express";

import { generateCinematic } from "./generate";

/* ------------------------------------------------------- */

const router = Router();

/* ------------------------------------------------------- */

router.post("/generate", generateCinematic);

/* ------------------------------------------------------- */

export default router;