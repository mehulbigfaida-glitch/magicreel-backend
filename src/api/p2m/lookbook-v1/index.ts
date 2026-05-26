import { Router } from "express";

import {
generateLookbookV1
} from "./generate-v1";

import { exportLookbook }
from "../lookbook/export";

import { authenticate }
from "../../../auth/jwt.middleware";

const router=Router();

router.post(
"/generate",
authenticate,
generateLookbookV1
);

router.post(
"/export",
authenticate,
(req,res)=>
exportLookbook(
req,
res
)
);

export default router;