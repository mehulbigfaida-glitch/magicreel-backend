export const GST_RATE = 18;

export const PLAN_CONFIG = {
  BASIC: {
    credits: 10,
    baseAmountPaise: 90000,
    usd: 9,
  },

  PRO: {
    credits: 30,
    baseAmountPaise: 240000,
    usd: 27,
  },

  ADVANCE: {
    credits: 60,
    baseAmountPaise: 360000,
    usd: 39,
  },
} as const;

export const CREDIT_RATES = {
  BASIC: 90,
  PRO: 80,
  ADVANCE: 60,
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
