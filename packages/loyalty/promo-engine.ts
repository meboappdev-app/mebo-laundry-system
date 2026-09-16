export interface PromotionRule {
  type:
    | "SERVICE_COUNT"
    | "WEIGHT"
    | "SPEND";
  target: string;
  threshold: number;
  reward: string;
}

export function checkPromotion(
  progress: number,
  threshold: number
): boolean {
  return (
    Number.isFinite(progress) &&
    Number.isFinite(threshold) &&
    threshold > 0 &&
    progress >= threshold
  );
}
