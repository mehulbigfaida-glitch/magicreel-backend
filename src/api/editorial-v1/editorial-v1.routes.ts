import { Router } from 'express'

import {
  generateEditorialV1,
} from './generate'

import {
  generateEditorialV1Image,
} from './generate-editorial-v1'

const router = Router()

router.post(
  '/generate',
  generateEditorialV1
)

router.post(
  '/generate-image',
  generateEditorialV1Image
)

export default router