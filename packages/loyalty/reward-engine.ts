export interface PointRewardRule {
  points: number;
  discountPercent: number;
}

export const DEFAULT_REWARD_RULES:
  PointRewardRule[] = [
    {
      points: 1000,
      discountPercent: 10
    },
    {
      points: 2000,
      discountPercent: 20
    },
    {
      points: 3000,
      discountPercent: 30
    }
  ];

export function getPointDiscount(
  points: number,
  rules = DEFAULT_REWARD_RULES
): number {
  const sorted = [...rules].sort(
    (a, b) => b.points - a.points
  );

  return (
    sorted.find(
      rule => points >= rule.points
    )?.discountPercent ?? 0
  );
}
