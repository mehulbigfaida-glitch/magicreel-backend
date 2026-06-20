import { Router } from "express";
import { authenticate } from "../auth/jwt.middleware";
import { publishController } from "./publish.controller";

const router = Router();

router.post(
  "/publish",
  authenticate,
  publishController.publish.bind(
    publishController
  )
);

export default router;