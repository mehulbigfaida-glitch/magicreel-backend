import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Plan, BillingCycle } from "@prisma/client";

import { prisma } from "../../magicreel/db/prisma";
import { calculateSubscriptionEnd } from "../../subscription/subscription.utils";
import { MailService } from "../../mail/mail.service";

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

// ======================================================
// ADMIN: LIST TESTING CREDIT REQUESTS
// ======================================================

export async function getTestingCreditRequests(
  req: Request,
  res: Response
) {
  try {
    const requests =
      await prisma.testingCreditRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    const results = await Promise.all(
      requests.map(async (request) => {
        const email =
          request.email.trim().toLowerCase();

        const mobile =
          request.mobile?.trim() || null;

        const company =
          request.company.trim();

        const existingUserByEmail =
          await prisma.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
              email: true,
              plan: true,
              isPaid: true,
            },
          });

        const existingUserByMobile =
          mobile
            ? await prisma.user.findFirst({
                where: {
                  mobileNumber: mobile,
                },
                select: {
                  id: true,
                  email: true,
                  mobileNumber: true,
                },
              })
            : null;

        const existingBusinessProfile =
          await prisma.businessProfile.findFirst({
            where: {
              companyName: company,
            },
            select: {
              userId: true,
              companyName: true,
            },
          });

        const emailDomain =
  email.split("@")[1]?.toLowerCase() || "";

const personalEmailDomains = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "aol.com",
  "icloud.com",
]);

const corporateEmail =
  !!emailDomain &&
  !personalEmailDomains.has(emailDomain);

        return {
          ...request,

          review: {
            emailAlreadyRegistered:
              !!existingUserByEmail,

            mobileAlreadyRegistered:
              !!existingUserByMobile,

            companyAlreadyUsed:
              !!existingBusinessProfile,

            corporateEmail,

            existingUser:
              existingUserByEmail,

            existingMobileUser:
              existingUserByMobile,

            existingCompany:
              existingBusinessProfile,
          },
        };
      })
    );

    return res.json({
      success: true,
      requests: results,
    });
  } catch (err: any) {
    console.error(
      "ADMIN TESTING CREDIT LIST ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      error:
        err?.message ||
        "Unable to load testing credit requests.",
    });
  }
}

// ======================================================
// ADMIN: REJECT TESTING CREDIT REQUEST
// ======================================================

export async function rejectTestingCreditRequest(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const request =
      await prisma.testingCreditRequest.findUnique({
        where: { id },
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Testing credit request not found.",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        error:
          `Request is already ${request.status}.`,
      });
    }

    const updated =
      await prisma.testingCreditRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
        },
      });

    return res.json({
      success: true,
      request: updated,
    });
  } catch (err: any) {
    console.error(
      "ADMIN REJECT TESTING CREDIT ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      error:
        err?.message ||
        "Unable to reject testing credit request.",
    });
  }
}

// ======================================================
// ADMIN: APPROVE TESTING CREDIT REQUEST
// ======================================================

export async function approveTestingCreditRequest(
  req: Request,
  res: Response
) {
  try {
    // ============================================
    // ADMIN CHECK
    // ============================================

    const adminUser = (req as any).user;

    if (
      !adminUser?.id ||
      adminUser.id !==
        (process.env.ADMIN_USER_ID ||
          "f859ac9b-96d5-4af1-81fc-401428d6bda4")
    ) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
      });
    }

    const { id } = req.params;

    // ============================================
    // LOAD REQUEST
    // ============================================

    const request =
      await prisma.testingCreditRequest.findUnique({
        where: { id },
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        error:
          "Testing credit request not found.",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        error:
          `Request is already ${request.status}.`,
      });
    }

    // ============================================
    // NORMALIZE DATA
    // ============================================

    const email =
      request.email.trim().toLowerCase();

    const mobile =
      request.mobile?.trim() || null;

    const company =
      request.company.trim();

    const fullName =
      request.name.trim();

    // ============================================
    // DUPLICATE EMAIL CHECK
    // ============================================

    const existingUserByEmail =
      await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
        },
      });

    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        error:
          "A MagicReel account already exists with this email address.",
      });
    }

    // ============================================
    // DUPLICATE MOBILE CHECK
    // ============================================

    if (mobile) {
      const existingUserByMobile =
        await prisma.user.findFirst({
          where: {
            mobileNumber: mobile,
          },
          select: {
            id: true,
            email: true,
            mobileNumber: true,
          },
        });

      if (existingUserByMobile) {
        return res.status(409).json({
          success: false,
          error:
            "A MagicReel account already exists with this mobile number.",
        });
      }
    }

    // ============================================
    // COMPANY CHECK
    //
    // Existing company is ALLOWED.
    // Multiple employees can belong to one company.
    // ============================================

    const existingBusinessProfile =
      await prisma.businessProfile.findFirst({
        where: {
          companyName: {
            equals: company,
            mode: "insensitive",
          },
        },
        select: {
          userId: true,
          companyName: true,
        },
      });

    if (existingBusinessProfile) {
      console.log(
        "TESTING CREDIT APPROVAL: Existing company found.",
        {
          company,
          existingUserId:
            existingBusinessProfile.userId,
        }
      );
    }

    // ============================================
    // PASSWORD SETUP TOKEN
    // ============================================

    const setupToken =
      crypto.randomBytes(32).toString("hex");

    const hashedSetupToken =
      crypto
        .createHash("sha256")
        .update(setupToken)
        .digest("hex");

    const setupExpiresAt =
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

    /*
     * The account must have a passwordHash because
     * User.passwordHash is required.
     *
     * This temporary random password is never
     * communicated to the user.
     *
     * The user sets their real password through
     * the setup/reset link sent below.
     */

    const temporaryPassword =
      crypto.randomBytes(32).toString("hex");

    const passwordHash =
      await bcrypt.hash(
        temporaryPassword,
        10
      );

    // ============================================
    // BASIC SUBSCRIPTION
    // ============================================

    const subscriptionStart =
      new Date();

    const subscriptionEnd =
      calculateSubscriptionEnd(
        subscriptionStart
      );

    // ============================================
    // CREATE ACCOUNT
    // ============================================

    const createdUser =
      await prisma.$transaction(
        async (tx) => {
          // --------------------------------------
          // USER
          // --------------------------------------

          const user =
            await tx.user.create({
              data: {
                fullName,

                mobileNumber:
                  mobile,

                email,

                passwordHash,

                plan: Plan.BASIC,

                isPaid: false,

                subscriptionType:
                  BillingCycle.MONTHLY,

                subscriptionStart,

                subscriptionEnd,

                creditsAvailable: 10,

                rolloverCredits: 0,

                /*
                 * Testing account does not receive
                 * the FREE welcome hero.
                 */
                freeHeroUsed: true,

                passwordResetToken:
                  hashedSetupToken,

                passwordResetExpiresAt:
                  setupExpiresAt,
              },
            });

          // --------------------------------------
          // USER PROFILE
          // --------------------------------------

          await tx.userProfile.create({
            data: {
              userId: user.id,

              fullName:
                user.fullName,

              companyName:
                company,

              phone:
                user.mobileNumber,

              email:
                user.email,

              country: "India",
            },
          });

          // --------------------------------------
          // BUSINESS PROFILE
          // --------------------------------------

          await tx.businessProfile.create({
            data: {
              userId: user.id,

              brandName:
                company,

              companyName:
                company,

              onboardingStep: 1,

              completed: false,

              // No Zernio integration
              // for testing BASIC accounts.
              zernioProfileId: null,
            },
          });

          // --------------------------------------
          // CREDIT TRANSACTION
          // --------------------------------------

          await tx.creditTransaction.create({
            data: {
              userId: user.id,

              credits: 10,

              feature:
                "TESTING_CREDIT_APPROVAL",

              type: "CREDIT",

              status: "COMPLETED",

              referenceId:
                request.id,
            },
          });

          // --------------------------------------
          // LINK REQUEST → USER
          // --------------------------------------

          await tx.testingCreditRequest.update({
            where: {
              id: request.id,
            },

            data: {
              userId: user.id,
            },
          });

          return user;
        }
      );

    // ============================================
    // APPROVAL EMAIL
    // ============================================

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "https://magicreel.in";

    const setupUrl =
      `${frontendUrl}/reset-password?token=${setupToken}`;

    /*
     * Documentation URL is intentionally added now.
     *
     * We will build the actual guideline content
     * separately later.
     */

    const documentationUrl =
      `${frontendUrl}/resources/guides/testing-credits`;

    try {
      const emailResult =
        await MailService.sendEmail(
          createdUser.email,

          "Your MagicReel Testing Credits Have Been Approved",

          `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">

            <h2>Welcome to MagicReel</h2>

            <p>
              Hello ${createdUser.fullName},
            </p>

            <p>
              Your MagicReel testing credit request
              has been approved.
            </p>

            <p>
              We have added
              <strong>10 testing credits</strong>
              to your account.
            </p>

            <p>
              <strong>Plan:</strong> BASIC
            </p>

            <p>
              Set your MagicReel password using the
              link below:
            </p>

            <p>
              <a
                href="${setupUrl}"
                style="
                  display:inline-block;
                  padding:12px 20px;
                  background:#4f6df5;
                  color:#fff;
                  text-decoration:none;
                  border-radius:6px;
                "
              >
                Set Your MagicReel Password
              </a>
            </p>

            <p>
              Before you begin, please read:
            </p>

            <p>
              <a href="${documentationUrl}">
                How to effectively use Testing Credits
              </a>
            </p>

            <p>
              This guide will help you explore the full
              scope of MagicReel during your testing.
            </p>

            <p>
              Welcome to MagicReel.
            </p>

          </div>
          `
        );

      if (emailResult.error) {
        console.error(
          "TESTING CREDIT APPROVAL EMAIL ERROR:",
          emailResult.error
        );
      }
    } catch (emailError) {
      /*
       * Account creation has already succeeded.
       * Email failure should not destroy the account.
       */
      console.error(
        "TESTING CREDIT APPROVAL EMAIL FAILED:",
        emailError
      );
    }

    // ============================================
    // MARK REQUEST APPROVED
    // ============================================

    const approvedRequest =
      await prisma.testingCreditRequest.update({
        where: {
          id: request.id,
        },

        data: {
          status: "APPROVED",
        },
      });

    return res.json({
      success: true,

      message:
        "Testing credit request approved and BASIC account created.",

      request: approvedRequest,

      user: {
        id: createdUser.id,

        email:
          createdUser.email,

        plan:
          createdUser.plan,

        credits:
          createdUser.creditsAvailable,

        isPaid:
          createdUser.isPaid,
      },
    });

  } catch (err: any) {
    console.error(
      "ADMIN APPROVE TESTING CREDIT ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      error:
        err?.message ||
        "Unable to approve testing credit request.",
    });
  }
}