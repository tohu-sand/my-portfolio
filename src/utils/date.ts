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

export interface DatePartsUTC {
  year: number;
  month: number;
  day: number;
  weekday: string;
  iso: string;
}

/** コンテンツの date は UTC 0時で解釈されるため、UTC 基準で分解する */
export function getDatePartsUTC(date: Date): DatePartsUTC {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.toLocaleDateString("ja-JP", { weekday: "short", timeZone: "UTC" }),
    iso: date.toISOString().slice(0, 10),
  };
}

/** 日付降順で並んだエントリを、年ごと（新しい年が先）にまとめる */
export function groupByYearDesc<T extends { data: { date: Date } }>(
  entries: T[],
): Array<[number, T[]]> {
  const groups = new Map<number, T[]>();
  for (const entry of entries.slice().sort(compareByDateDesc)) {
    const year = entry.data.date.getUTCFullYear();
    const list = groups.get(year);
    if (list) {
      list.push(entry);
    } else {
      groups.set(year, [entry]);
    }
  }
  return [...groups.entries()].sort(([a], [b]) => b - a);
}
