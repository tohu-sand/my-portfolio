import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isPublishedInfo } from '../../utils/info';
import { compareByDateDesc } from '../../utils/date';

export async function GET(context) {
  const infos = await getCollection('info', isPublishedInfo);

  // 日付順にソート（新しい順）
  const sortedInfos = infos.sort(compareByDateDesc);

  return rss({
    title: 'hasamiyacco: お知らせ',
    description: '豆腐さんどのお知らせ・イベント情報です。',
    site: context.site,
    items: sortedInfos.map((info) => ({
      title: info.data.title,
      pubDate: info.data.date,
      description: info.data.description,
      link: new URL(`/info/#${info.id}`, context.site).toString(),
      categories: [info.data.category],
    })),
    customData: `<language>ja</language>`,
  });
}
