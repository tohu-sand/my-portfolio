import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const gallery = await getCollection('gallery');
  
  // 日付順にソート（新しい順）
  const sortedGallery = gallery.sort((a, b) => 
    b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: '豆腐さんど: ギャラリー',
    description: '豆腐さんどのイラストギャラリーです。新作イラストを配信しています。',
    site: context.site,
    items: sortedGallery.map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.description || item.data.title,
      link: `/gallery/${item.slug}/`,
      categories: item.data.tags || [],
      // 画像をエンクロージャーとして追加（RSSリーダーで画像が表示される）
      enclosure: item.data.thumbnail ? {
        url: `${context.site}${item.data.thumbnail}`,
        type: 'image/jpeg',
        length: 0, // 正確なサイズが不明な場合は0を指定可能
      } : undefined,
    })),
    customData: `<language>ja</language>`,
  });
}
