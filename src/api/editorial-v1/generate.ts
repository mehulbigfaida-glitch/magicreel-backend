import { Request, Response } from 'express'

import {
  generateEditorialV1Prompt,
} from '../../magicreel/editorial-v1/editorial-v1.service'

export async function generateEditorialV1(
  req: Request,
  res: Response
) {
  try {
    const {
      worldId,
      variationSeed,
    } = req.body

    const result =
      await generateEditorialV1Prompt({
        worldId,
        variationSeed,
      })

    return res.status(200).json(result)
  } catch (error: any) {
    console.error(
      'EDITORIAL_V1_GENERATION_ERROR',
      error
    )

    return res.status(500).json({
      success: false,
      error:
        error?.message ??
        'Editorial V1 generation failed',
    })
  }
}