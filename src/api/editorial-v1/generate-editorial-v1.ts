import { prisma } from "../../magicreel/db/prisma"

import { Request, Response } from "express"

import { FashnService } from "../../magicreel/services/fashn.service"

import { finalizeBilling } from "../../billing/billing.middleware"

import {
  buildEditorialPrompt,
} from "../../magicreel/editorial-v1/builders/editorialPromptBuilder"

const fashn = new FashnService()

export async function generateEditorialV1Image(
  req: Request,
  res: Response
) {
  try {
    const {
      worldId,

      shotId,

      variationSeed,

      avatarFaceImageUrl,

      garmentFrontImageUrl,
    } = req.body

    if (
      !avatarFaceImageUrl ||
      !garmentFrontImageUrl
    ) {
      return res.status(400).json({
        error:
          "Missing editorial generation inputs",
      })
    }

    /* =========================
       USER FETCH
    ========================= */

    const user = (req as any).user

    if (!user || !user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      })
    }

    const userId =
      user.userId || user.id

    /* =========================
       CREDIT CHECK
    ========================= */

    const dbUser =
      await prisma.user.findUnique({
        where: { id: userId },

        select: {
          creditsAvailable: true,
        },
      })

    if (!dbUser) {
      return res.status(404).json({
        error: "User not found",
      })
    }

    if (dbUser.creditsAvailable <= 0) {
      return res.status(403).json({
        error: "No credits left",
      })
    }

    /* =========================
       EDITORIAL PROMPT
    ========================= */

    const editorialPrompt =
      buildEditorialPrompt({
        worldId,
        shotId,
        variationSeed,
      })

    /* =========================
       CREATE JOB
    ========================= */

    const job =
      await prisma.productToModelJob.create({
        data: {
          userId,

          productImageUrl:
            garmentFrontImageUrl,

          modelImageUrl:
            avatarFaceImageUrl,

          engine: "editorial-v1",

          engineJobId: "pending",

          status: "running",
        },
      })

    ;(req as any).billing = {
      predictionId: job.id,
    }

    /* =========================
       FASHN GENERATION
    ========================= */

    const runId =
      await fashn.runProductToModel({
        garmentImageUrl:
          garmentFrontImageUrl,

        modelImageUrl:
          avatarFaceImageUrl,

        prompt: editorialPrompt,
      })

    await prisma.productToModelJob.update({
      where: {
        id: job.id,
      },

      data: {
        engineJobId: runId,
      },
    })

    /* =========================
       BILLING
    ========================= */

    ;(req as any).predictionId =
      job.id

    try {
      await finalizeBilling(req)
    } catch (e) {
      console.error(
        "Editorial billing failed:",
        e
      )
    }

    return res.json({
      success: true,

      runId,

      prompt: editorialPrompt,
    })
  } catch (err: any) {
    console.error(
      "EDITORIAL_V1_IMAGE_ERROR:",
      err
    )

    return res.status(500).json({
      error:
        err.message ||
        "Editorial V1 generation failed",
    })
  }
}