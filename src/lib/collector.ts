// XP/Level system
const LEVELS = [
  { level: 1, title: 'Novice', xpNeeded: 0 },
  { level: 2, title: 'Reader', xpNeeded: 3 },
  { level: 3, title: 'Bookworm', xpNeeded: 5 },
  { level: 4, title: 'Scholar', xpNeeded: 10 },
  { level: 5, title: 'Librarian', xpNeeded: 15 },
  { level: 6, title: 'Curator', xpNeeded: 25 },
  { level: 7, title: 'Archivist', xpNeeded: 40 },
  { level: 8, title: 'Sage', xpNeeded: 60 },
  { level: 9, title: 'Legend', xpNeeded: 100 },
];

export function getCollectorLevel(bookCount: number) {
  let current = LEVELS[0];
  let next = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (bookCount >= LEVELS[i].xpNeeded) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }

  const progress = next
    ? (bookCount - current.xpNeeded) / (next.xpNeeded - current.xpNeeded)
    : 1;

  return {
    level: current.level,
    title: current.title,
    progress: Math.min(1, Math.max(0, progress)),
    nextLevel: next?.xpNeeded ?? null,
    booksToNext: next ? next.xpNeeded - bookCount : 0,
  };
}
