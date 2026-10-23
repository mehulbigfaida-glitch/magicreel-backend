export const GST_RATE = 18;

export const PLAN_CONFIG = {
  BASIC: {
    credits: 10,
    baseAmountPaise: 90000,
    usd: 9,
  },

  PRO: {
    credits: 32,
    baseAmountPaise: 240000,
    usd: 24,
  },

  ADVANCE: {
    credits: 72,
    baseAmountPaise: 360000,
    usd: 36,
  },
} as const;

export const CREDIT_RATES = {
  BASIC: 90,
  PRO: 75,
  ADVANCE: 50,
} as const;

export const PUBLISHING_BASE_AMOUNT_PAISE =
  90000;

export function withGST(
  baseAmountPaise: number
): number {
  return Math.round(
    (baseAmountPaise * (100 + GST_RATE)) /
      100
  );
}
