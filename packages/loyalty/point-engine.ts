export interface PointCalculation {
  eligibleAmount: number;
  points: number;
}

export function calculateTransactionPoints(
  amount: number,
  amountPerPoint = 1000
): PointCalculation {
  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return {
      eligibleAmount: 0,
      points: 0
    };
  }

  if (
    !Number.isFinite(amountPerPoint) ||
    amountPerPoint <= 0
  ) {
    throw new Error(
      "amountPerPoint tidak valid."
    );
  }

  return {
    eligibleAmount: amount,
    points: Math.floor(
      amount / amountPerPoint
    )
  };
}

export function calculateTotalPoints(
  entries: Array<{
    points: number | null;
  }>
): number {
  return entries.reduce(
    (total, entry) =>
      total + (entry.points ?? 0),
    0
  );
}
