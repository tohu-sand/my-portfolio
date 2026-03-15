interface SluggableEntry {
  id: string;
  slug?: string;
}

export function entryToSlug(entry: SluggableEntry): string {
  return entry.slug ?? entry.id.replace(/\.md$/, "");
}
