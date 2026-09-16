import { randomInt } from "crypto";

const CHARACTERS =
  "ACDEFGHJKLMNPQRTUVWXYZ234679";

export function generateMemberCode(): string {
  let result = "";

  for (let i = 0; i < 7; i++) {
    result += CHARACTERS[randomInt(CHARACTERS.length)];
  }

  return `MB-${result}`;
}
