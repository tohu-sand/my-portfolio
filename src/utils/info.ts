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

/** 日付から状態を表示するカテゴリ */
const STATUS_CATEGORIES = new Set(["Event", "Publication"]);

export function hasDateStatus(category: string): boolean {
  return STATUS_CATEGORIES.has(category);
}

const STATUS_LABELS: Record<string, Partial<Record<EventStatus, string>>> = {
  Event: { upcoming: "開催予定", today: "本日開催", past: "終了" },
  // 過去の掲載物に「終了」は不自然なので、発売前のみ表示する
  Publication: { upcoming: "発売予定", today: "本日発売" },
};

/** カテゴリと状態に応じたバッジ文言。表示しない場合は null */
export function getStatusLabel(category: string, status: EventStatus): string | null {
  return STATUS_LABELS[category]?.[status] ?? null;
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

/**
 * `src/content/info/drafts/` 配下のエントリは未公開の下書き。
 * このディレクトリは .gitignore で除外しているため、コミット・デプロイされない。
 */
export function isDraftInfo(entry: { id: string }): boolean {
  return entry.id.startsWith("drafts/");
}

/**
 * 公開対象のエントリかどうか。
 * 下書きは `astro dev` では確認用に表示し、本番ビルド（`astro build`）では除外する。
 */
export function isPublishedInfo(entry: { id: string }): boolean {
  return import.meta.env.DEV || !isDraftInfo(entry);
}
