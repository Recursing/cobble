const MAGIC_DIFFERENCES = [0, 1, 3, 13, 32, 36, 43, 52];
const N_CARDS = 57;

export const CARDS: Set<number>[] = [...Array(N_CARDS)].map(() => new Set());
[...Array(N_CARDS)].map((_, i) => {
  MAGIC_DIFFERENCES.forEach((offset) => {
    CARDS[(offset + i) % N_CARDS].add(i);
  });
});

// Check
for (const card of CARDS) {
  if (card.size !== 8) {
    console.error(card);
    throw Error("A card doesn't have exactly 8 symbols");
  }
  for (const otherCard of CARDS) {
    if (card === otherCard) {
      continue;
    }
    if (Array.from(card).filter((s) => otherCard.has(s)).length !== 1) {
      console.error(card, otherCard);
      throw Error("Some cards don't have exactly one symbol in common");
    }
  }
}
