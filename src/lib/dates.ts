export function todayStamp(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(stamp: string, days: number): string {
  const [year, month, day] = stamp.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return todayStamp(date);
}

export function isDue(due: string, today = todayStamp()): boolean {
  return due <= today;
}

export function msUntilNextLocalMidnight(now = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(0, next.getTime() - now.getTime());
}
