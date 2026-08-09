import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function requestTestingCredits(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      designation,
      company,
      email,
      mobile,
      instagram,
      requestedFeatures,
    } = req.body;

    // ============================================
    // VALIDATION
    // ============================================

    if (
      !name ||
      !designation ||
      !company ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Name, designation, company and email are required.",
      });
    }

    // ============================================
    // CREATE REQUEST
    // ============================================

    const request =
      await prisma.testingCreditRequest.create({
        data: {
          name: String(name).trim(),
          designation: String(designation).trim(),
          company: String(company).trim(),
          email: String(email).trim().toLowerCase(),

          mobile:
            mobile
              ? String(mobile).trim()
              : null,

          instagram:
            instagram
              ? String(instagram).trim()
              : null,

          requestedFeatures:
            Array.isArray(requestedFeatures)
              ? requestedFeatures
              : [],
        },
      });

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(201).json({
      success: true,
      message:
        "Your testing credit request has been received.",
      requestId: request.id,
    });

  } catch (err: any) {
    console.error(
      "TESTING CREDIT REQUEST ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      error:
        err?.message ||
        "Unable to submit testing credit request.",
    });
  }
}
