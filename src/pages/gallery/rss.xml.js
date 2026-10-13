import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { compareByDateDesc } from '../../utils/date';

export async function GET(context) {
  const gallery = await getCollection('gallery');

  // 日付順にソート（新しい順）
  const sortedGallery = gallery.sort(compareByDateDesc);

  return rss({
    title: 'hasamiyacco: ギャラリー',
    description: '豆腐さんどのイラスト・漫画ギャラリーです。',
    site: context.site,
    items: sortedGallery.map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.description,
      link: `/gallery/${item.id}/`,
      categories: item.data.tags || [],
      enclosure: {
        url: item.data.thumbnail,
        type: 'image/webp',
        // サイズ不明なので0
        length: 0,
      },
    })),
    customData: `<language>ja</language>`,
  });
}
