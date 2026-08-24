const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calculateCreditValidityEnd(
  purchaseDate: Date = new Date()
): Date {
  const end = new Date(purchaseDate);
  end.setDate(end.getDate() + 90);
  end.setMilliseconds(end.getMilliseconds() - 1);

  return end;
}

export function calculateSubscriptionEnd(startDate: Date): Date {
  const end = new Date(startDate);
  end.setDate(end.getDate() + 30);
  end.setMilliseconds(end.getMilliseconds() - 1);

  return end;
}

export function isSubscriptionExpired(
  subscriptionEnd?: Date | null
): boolean {
  if (!subscriptionEnd) return true;

  return new Date() > subscriptionEnd;
}

export function getRemainingSubscriptionDays(
  subscriptionEnd?: Date | null
): number {
  if (!subscriptionEnd) return 0;

  const diff = subscriptionEnd.getTime() - Date.now();

  if (diff <= 0) return 0;

  return Math.ceil(diff / MS_PER_DAY);
}

export function getSubscriptionProgress(
  subscriptionStart?: Date | null,
  subscriptionEnd?: Date | null
): number {
  if (!subscriptionStart || !subscriptionEnd) {
    return 0;
  }

  const total =
    subscriptionEnd.getTime() - subscriptionStart.getTime();

  if (total <= 0) {
    return 0;
  }

  const elapsed =
    Date.now() - subscriptionStart.getTime();

  const percent = (elapsed / total) * 100;

  return Math.max(0, Math.min(100, Math.round(percent)));
}

export function isSubscriptionActive(
  subscriptionStart?: Date | null,
  subscriptionEnd?: Date | null
): boolean {
  if (!subscriptionStart || !subscriptionEnd) {
    return false;
  }

  const now = new Date();

  return now >= subscriptionStart && now <= subscriptionEnd;
}