import { prisma } from "../magicreel/db/prisma";

export interface DomesticBillingProfileInput {
  fullName?: string;
  companyName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  gstin?: string;
  phone?: string;
}

export async function isDomesticBillingComplete(
  userId: string
): Promise<boolean> {
  const profile =
    await prisma.userProfile.findUnique({
      where: {
        userId,
      },
      select: {
        fullName: true,
        addressLine1: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    });

  if (!profile) {
    return false;
  }

  return Boolean(
    profile.fullName?.trim() &&
    profile.addressLine1?.trim() &&
    profile.city?.trim() &&
    profile.state?.trim() &&
    profile.postalCode?.trim() &&
    profile.country?.trim()
  );
}

export async function getBillingProfile(
  userId: string
) {
  return prisma.userProfile.findUnique({
    where: {
      userId,
    },
  });
}

export async function updateBillingProfile(
  userId: string,
  data: DomesticBillingProfileInput
) {
  return prisma.userProfile.update({
    where: {
      userId,
    },

    data: {
      ...(data.fullName !== undefined && {
        fullName:
          data.fullName?.trim() || "",
      }),

      ...(data.companyName !== undefined && {
        companyName:
          data.companyName?.trim() || null,
      }),

      ...(data.addressLine1 !== undefined && {
        addressLine1:
          data.addressLine1?.trim() || null,
      }),

      ...(data.addressLine2 !== undefined && {
        addressLine2:
          data.addressLine2?.trim() || null,
      }),

      ...(data.city !== undefined && {
        city:
          data.city?.trim() || null,
      }),

      ...(data.state !== undefined && {
        state:
          data.state?.trim() || null,
      }),

      ...(data.postalCode !== undefined && {
        postalCode:
          data.postalCode?.trim() || null,
      }),

      ...(data.country !== undefined && {
        country:
          data.country?.trim() || "India",
      }),

      ...(data.gstin !== undefined && {
        gstin:
          data.gstin?.trim() || null,
      }),

      ...(data.phone !== undefined && {
        phone:
          data.phone?.trim() || null,
      }),
    },
  });
}
