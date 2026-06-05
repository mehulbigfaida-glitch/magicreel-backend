import { Router } from "express";

import {
generateLookbookV1
} from "./generate-v1";

import { exportLookbook }
from "../lookbook/export";

import { authenticate }
from "../../../auth/jwt.middleware";

import {
testMultiAngle
} from "./test-multiangle";

const router=Router();

router.post(
"/test-multiangle",
testMultiAngle
);

router.post(
"/test-multiangle",
authenticate,
testMultiAngle
);

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