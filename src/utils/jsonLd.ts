export const person = {
  "@type": "Person",
  "@id": "https://tohu-sand.com/#person",
  "name": "豆腐さんど",
  "url": "https://tohu-sand.com/",
};

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
