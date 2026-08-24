import { prisma } from "../magicreel/db/prisma";

export interface UpdateBusinessProfileInput {
  brandName?: string;
  companyName?: string;
  logoUrl?: string;

  website?: string;
  tagline?: string;

  businessCategory?: string;
  industry?: string;

  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  pinterest?: string;
  twitter?: string;

  onboardingStep?: number;
  completed?: boolean;
}

/**
 * ------------------------------------------------------------
 * Get Business Profile
 * ------------------------------------------------------------
 */
export async function getBusinessProfile(userId: string) {
  const profile = await prisma.businessProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new Error("Business profile not found");
  }

  return profile;
}

export async function isBusinessProfileComplete(
  userId: string
): Promise<boolean> {
  const profile =
    await prisma.businessProfile.findUnique({
      where: {
        userId,
      },
      select: {
        completed: true,
      },
    });

  return profile?.completed === true;
}

/**
 * ------------------------------------------------------------
 * Update Business Profile
 * ------------------------------------------------------------
 */
export async function updateBusinessProfile(
  userId: string,
  data: UpdateBusinessProfileInput
) {
  const profile = await prisma.businessProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new Error("Business profile not found");
  }

  const updatedProfile = await prisma.businessProfile.update({
    where: {
      userId,
    },
    data: {
      ...(data.brandName !== undefined && {
        brandName: data.brandName.trim(),
      }),

      ...(data.companyName !== undefined && {
        companyName: data.companyName?.trim() || null,
      }),

      ...(data.logoUrl !== undefined && {
        logoUrl: data.logoUrl,
      }),

      ...(data.website !== undefined && {
        website: data.website?.trim() || null,
      }),

      ...(data.tagline !== undefined && {
        tagline: data.tagline?.trim() || null,
      }),

      ...(data.businessCategory !== undefined && {
        businessCategory: data.businessCategory?.trim() || null,
      }),

      ...(data.industry !== undefined && {
        industry: data.industry?.trim() || null,
      }),

      ...(data.instagram !== undefined && {
        instagram: data.instagram?.trim() || null,
      }),

      ...(data.facebook !== undefined && {
        facebook: data.facebook?.trim() || null,
      }),

      ...(data.youtube !== undefined && {
        youtube: data.youtube?.trim() || null,
      }),

      ...(data.linkedin !== undefined && {
        linkedin: data.linkedin?.trim() || null,
      }),

      ...(data.pinterest !== undefined && {
        pinterest: data.pinterest?.trim() || null,
      }),

      ...(data.twitter !== undefined && {
        twitter: data.twitter?.trim() || null,
      }),

      ...(data.onboardingStep !== undefined && {
        onboardingStep: data.onboardingStep,
      }),

      ...(data.completed !== undefined && {
        completed: data.completed,
      }),
    },
  });

  return updatedProfile;
}

/**
 * ------------------------------------------------------------
 * Update Logo Only
 * ------------------------------------------------------------
 */
export async function updateBusinessLogo(
  userId: string,
  logoUrl: string
) {
  const updatedProfile = await prisma.businessProfile.update({
    where: {
      userId,
    },
    data: {
      logoUrl,
    },
  });

  return updatedProfile;
}