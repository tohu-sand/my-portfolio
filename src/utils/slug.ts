export function idToSlug(id: string): string {
  return id.replace(/\.md$/, "");
}

interface SluggableEntry {
  id: string;
  slug?: string;
}

export function entryToSlug(entry: SluggableEntry): string {
  return entry.slug ?? idToSlug(entry.id);
}
