export function formatDateJP(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export function compareByDateDesc<T extends { data: { date: Date } }>(
  a: T,
  b: T,
): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function compareByDateAsc<T extends { data: { date: Date } }>(
  a: T,
  b: T,
): number {
  return a.data.date.getTime() - b.data.date.getTime();
}
