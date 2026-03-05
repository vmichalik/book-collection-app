const MESSAGES: Record<number, string> = {
  5: 'Your first shelf is filling up!',
  10: 'Double digits! A true collector.',
  25: 'A proper personal library!',
  50: 'Half a century of books!',
  100: 'Triple digits. Legendary.',
};

export function getMilestoneMessage(count: number): string | null {
  return MESSAGES[count] || null;
}
