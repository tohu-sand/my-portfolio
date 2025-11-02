import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const infos = await getCollection('info');
  
  // 日付順にソート（新しい順）
  const sortedInfos = infos.sort((a, b) => 
    b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: '豆腐さんど: お知らせ',
    description: '豆腐さんどのお知らせ・イベント情報です。',
    site: context.site,
    items: sortedInfos.map((info) => ({
      title: info.data.title,
      pubDate: info.data.date,
      description: info.data.description || `${info.data.category}の情報です。${info.data.location ? `場所: ${info.data.location}` : ''}`,
      link: `/info/#${info.slug}`,
      categories: [info.data.category],
    })),
    customData: `<language>ja</language>`,
  });
}
