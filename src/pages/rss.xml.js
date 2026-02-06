import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { entryToSlug } from '../utils/slug';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  // 日付順にソート（新しい順）
  const sortedPosts = posts.slice().sort((a, b) => 
    b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: '豆腐さんど: ブログ',
    description: '豆腐さんどのブログです。イラストや創作に関する記事、日常の出来事などを投稿しています。',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt || '',
      link: `/blog/${entryToSlug(post)}/`,
      categories: post.data.tags || [],
    })),
    customData: `<language>ja</language>`,
  });
}
