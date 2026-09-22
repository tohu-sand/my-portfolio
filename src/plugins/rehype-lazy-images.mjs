/**
 * Markdown 本文の <img> に loading="lazy" と decoding="async" を付ける rehype プラグイン。
 * 記事の見出し画像（テンプレート側で fetchpriority="high"）より先に、画面外の本文画像が
 * 取得されるのを防ぐ。属性が既に指定されている img（Bluesky スナップショットなど）はそのまま。
 */
export function rehypeLazyImages() {
  const visit = (node) => {
    if (node.type === "element" && node.tagName === "img") {
      node.properties.loading ??= "lazy";
      node.properties.decoding ??= "async";
    }
    for (const child of node.children ?? []) {
      visit(child);
    }
  };
  return (tree) => visit(tree);
}
