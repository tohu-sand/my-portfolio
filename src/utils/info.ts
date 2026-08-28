export type EventStatus = "upcoming" | "today" | "past";

/**
 * ビルド時点の「今日」(UTC 0時)。
 * コンテンツの date も UTC 0時で解釈されるため、同じ基準で比較する。
 * 静的ビルドのため、状態はビルド時点のものになる（トップページの Upcoming Info と同じ制約）。
 */
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

export interface LinkMeta {
  label: string;
  icon: string;
}

/** リンク先のホストに応じてラベルとアイコンを決める */
export function getLinkMeta(url: string): LinkMeta {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    host = "";
  }
  if (host === "bsky.app") {
    return { label: "Blueskyで見る", icon: "simple-icons:bluesky" };
  }
  if (host === "twitter.com" || host === "x.com") {
    return { label: "Twitterで見る", icon: "simple-icons:twitter" };
  }
  return { label: "詳細を見る", icon: "lucide:external-link" };
}
