// Markdown本文の<img>を遅延読み込みに設定
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
