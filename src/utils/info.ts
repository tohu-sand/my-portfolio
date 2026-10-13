export type EventStatus = "upcoming" | "today" | "past";

// ビルド時点の今日（UTCの0時）
export function getTodayUTC(): Date {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

export function getEventStatus(date: Date, today: Date): EventStatus {
  const d = date.getTime();
  const t = today.getTime();
  if (d > t) return "upcoming";
  if (d === t) return "today";
  return "past";
}

// 日付から状態を出すカテゴリ
const STATUS_CATEGORIES = new Set(["Event", "Publication"]);

export function hasDateStatus(category: string): boolean {
  return STATUS_CATEGORIES.has(category);
}

const STATUS_LABELS: Record<string, Partial<Record<EventStatus, string>>> = {
  Event: { upcoming: "開催予定", today: "本日開催", past: "終了" },
  // Publicationに「終了」は出さない
  Publication: { upcoming: "発売予定", today: "本日発売" },
};

export function getStatusLabel(category: string, status: EventStatus): string | null {
  return STATUS_LABELS[category]?.[status] ?? null;
}

interface LinkMeta {
  label: string;
  icon: string;
}

export function getLinkMeta(url: string): LinkMeta {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host === "bsky.app") {
    return { label: "Blueskyで見る", icon: "simple-icons:bluesky" };
  }
  if (host === "twitter.com" || host === "x.com") {
    return { label: "Twitterで見る", icon: "simple-icons:twitter" };
  }
  return { label: "詳細を見る", icon: "lucide:external-link" };
}

function isDraftInfo(entry: { id: string }): boolean {
  return entry.id.startsWith("drafts/");
}

// 下書きはdevでだけ出す
export function isPublishedInfo(entry: { id: string }): boolean {
  return import.meta.env.DEV || !isDraftInfo(entry);
}
