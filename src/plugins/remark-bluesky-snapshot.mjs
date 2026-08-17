import fs from "node:fs/promises";
import path from "node:path";

/**
 * Bluesky埋め込み（blockquote.bluesky-embed + embed.js）をビルド時に
 * 静的なスナップショットHTMLへ置換するremarkプラグイン。
 *
 * - 投稿データは初回のみ公開APIから取得し、src/data/bluesky/ にJSONキャッシュする
 * - アバター・添付画像は public/images/bluesky/ へダウンロードして自サイトから配信する
 * - キャッシュがある限りネットワークにもBluesky本体にも依存しないため、
 *   元の投稿が削除されても記事は壊れない
 * - キャッシュがなくAPI取得にも失敗した場合は、元の埋め込みHTMLをそのまま残す
 */

const API_ENDPOINT = "https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts";
const CACHE_DIR = "src/data/bluesky";
const IMAGE_DIR = "public/images/bluesky";
const IMAGE_BASE = "/images/bluesky";

const EXT_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

// devサーバー等でファイルごとに並行実行されても、同じ投稿・画像を
// 二重に取得しないようにするためのインフライトマップ
const inflight = new Map();

function dedupe(key, fn) {
  if (!inflight.has(key)) {
    inflight.set(key, fn().finally(() => inflight.delete(key)));
  }
  return inflight.get(key);
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseAtUri(uri) {
  const match = uri.match(/^at:\/\/(did:[^/]+)\/app\.bsky\.feed\.post\/([^/]+)$/);
  if (!match) return null;
  return { did: match[1], rkey: match[2] };
}

function snapshotKey({ did, rkey }) {
  return `${did.split(":").pop()}-${rkey}`;
}

function formatDateJST(iso) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

async function downloadImage(url, fileBase, cwd) {
  return dedupe(`img:${fileBase}`, async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`image fetch failed (${res.status}): ${url}`);
    const ext = EXT_BY_MIME[res.headers.get("content-type")] ?? ".jpg";
    const publicPath = `${IMAGE_BASE}/${fileBase}${ext}`;
    const filePath = path.join(cwd, IMAGE_DIR, `${fileBase}${ext}`);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, Buffer.from(await res.arrayBuffer()));
    return publicPath;
  });
}

async function fetchSnapshot(uri, parsed, cwd) {
  const res = await fetch(`${API_ENDPOINT}?uris=${encodeURIComponent(uri)}`);
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  const post = (await res.json()).posts?.[0];
  if (!post) throw new Error("post not found (deleted?)");

  const key = snapshotKey(parsed);
  const snapshot = {
    uri,
    url: `https://bsky.app/profile/${parsed.did}/post/${parsed.rkey}`,
    author: {
      displayName: post.author.displayName || post.author.handle,
      handle: post.author.handle,
      avatar: post.author.avatar
        ? await downloadImage(post.author.avatar, `avatar-${parsed.did.split(":").pop()}`, cwd)
        : null,
    },
    text: post.record.text ?? "",
    lang: post.record.langs?.[0] ?? "ja",
    createdAt: post.record.createdAt,
    images: [],
    fetchedAt: new Date().toISOString(),
  };

  const embedImages = post.embed?.$type === "app.bsky.embed.images#view" ? post.embed.images : [];
  for (const [i, image] of embedImages.entries()) {
    snapshot.images.push({
      src: await downloadImage(image.fullsize, `${key}-${i + 1}`, cwd),
      alt: image.alt ?? "",
      width: image.aspectRatio?.width ?? null,
      height: image.aspectRatio?.height ?? null,
    });
  }
  return snapshot;
}

async function loadSnapshot(uri, cwd) {
  const parsed = parseAtUri(uri);
  if (!parsed) throw new Error(`invalid at-uri: ${uri}`);
  const cachePath = path.join(cwd, CACHE_DIR, `${snapshotKey(parsed)}.json`);

  return dedupe(`snapshot:${cachePath}`, async () => {
    try {
      return JSON.parse(await fs.readFile(cachePath, "utf-8"));
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
    const snapshot = await fetchSnapshot(uri, parsed, cwd);
    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(snapshot, null, 2) + "\n");
    console.log(`[bluesky-snapshot] cached ${uri} -> ${path.relative(cwd, cachePath)}`);
    return snapshot;
  });
}

const BUTTERFLY_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>';

function renderImages(images) {
  if (images.length === 0) return "";
  const items = images
    .map((image) => {
      const size =
        image.width && image.height ? ` width="${image.width}" height="${image.height}"` : "";
      return `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"${size} class="m-0 w-full rounded-lg border border-stone-200 dark:border-stone-700" loading="lazy" decoding="async" />`;
    })
    .join("");
  const cols = images.length > 1 ? " grid-cols-2" : "";
  return `<div class="mt-3 grid gap-2${cols}">${items}</div>`;
}

function renderCard(snapshot) {
  const url = escapeHtml(snapshot.url);
  const avatar = snapshot.author.avatar
    ? `<img src="${escapeHtml(snapshot.author.avatar)}" alt="" width="40" height="40" class="m-0 h-10 w-10 shrink-0 rounded-full" loading="lazy" decoding="async" />`
    : "";
  return (
    `<figure class="bluesky-snapshot not-prose my-6 max-w-xl rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900">` +
    `<div class="flex items-center gap-3">` +
    avatar +
    `<div class="min-w-0 leading-tight">` +
    `<p class="m-0 truncate font-bold text-stone-900 dark:text-stone-100">${escapeHtml(snapshot.author.displayName)}</p>` +
    `<p class="m-0 truncate text-sm text-stone-500 dark:text-stone-400">@${escapeHtml(snapshot.author.handle)}</p>` +
    `</div>` +
    `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ml-auto shrink-0 text-[#1185fe]" aria-label="Blueskyで元の投稿を見る">${BUTTERFLY_SVG}</a>` +
    `</div>` +
    `<p lang="${escapeHtml(snapshot.lang)}" class="m-0 mt-3 whitespace-pre-wrap text-stone-900 dark:text-stone-100">${escapeHtml(snapshot.text)}</p>` +
    renderImages(snapshot.images) +
    `<figcaption class="m-0 mt-3 text-sm text-stone-500 dark:text-stone-400">` +
    `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-inherit no-underline hover:underline">${formatDateJST(snapshot.createdAt)}</a>` +
    `</figcaption>` +
    `</figure>`
  );
}

function collectEmbedNodes(node, found) {
  if (node.type === "html" && node.value?.includes("data-bluesky-uri")) {
    found.push(node);
  }
  for (const child of node.children ?? []) {
    collectEmbedNodes(child, found);
  }
}

export function remarkBlueskySnapshot() {
  return async (tree, file) => {
    const nodes = [];
    collectEmbedNodes(tree, nodes);

    for (const node of nodes) {
      const uri = node.value.match(/data-bluesky-uri="([^"]+)"/)?.[1];
      if (!uri) continue;
      try {
        node.value = renderCard(await loadSnapshot(uri, file.cwd ?? process.cwd()));
      } catch (err) {
        console.warn(
          `[bluesky-snapshot] ${uri} のスナップショット化に失敗しました（元の埋め込みを維持します）: ${err.message}`,
        );
      }
    }
  };
}
