import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { compareByDateDesc } from '../utils/date';

export async function GET(context) {
  const posts = await getCollection('posts');

  // 日付順にソート（新しい順）
  const sortedPosts = posts.sort(compareByDateDesc);

  return rss({
    title: 'hasamiyacco: ブログ',
    description: '豆腐さんどのブログです。',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.id}/`,
      categories: post.data.tags || [],
    })),
    customData: `<language>ja</language>`,
  });
}
