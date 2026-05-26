import { Router } from "express";

import { authenticate } from "../../../auth/jwt.middleware";

import { billingGuard } from "../../../billing/billing.middleware";

import {
generateLookbookV1
} from "./generate-v1";

const router=Router();

router.post(
"/generate",
authenticate,
billingGuard("LOOKBOOK_ECOM"),
generateLookbookV1
);

export default router;