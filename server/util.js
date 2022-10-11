  // Shuffling arrays:
  // https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last
  export function shuffle(symbolSet) {
    for (i = symbolSet.length -1 ; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [symbolSet[i], symbolSet[j]] = [symbolSet[j], symbolSet[i]];
    }
    return symbolSet;
  }