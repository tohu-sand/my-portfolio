export type GalleryKind = "illustration" | "comic";

/** 表示順も兼ねる */
export const GALLERY_KINDS: readonly GalleryKind[] = ["illustration", "comic"];

const KIND_LABELS: Record<GalleryKind, string> = {
  illustration: "イラスト",
  comic: "漫画",
};

/** frontmatter の `kind` は省略可能で、省略時はイラスト扱い */
export function getGalleryKind(data: { kind?: GalleryKind }): GalleryKind {
  return data.kind ?? "illustration";
}

export function getGalleryKindLabel(kind: GalleryKind): string {
  return KIND_LABELS[kind];
}
