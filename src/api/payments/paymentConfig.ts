export const GST_RATE = 18;

export const PLAN_CONFIG = {
  PRO: {
    credits: 27,
    baseAmountPaise: 90000,
    usd: 9,
  },
} as const;

export const CREDIT_RATES = {
  PRO: 35,
} as const;

export const PUBLISHING_BASE_AMOUNT_PAISE = 90000;

export function withGST(baseAmountPaise: number): number {
  return Math.round((baseAmountPaise * (100 + GST_RATE)) / 100);
}
