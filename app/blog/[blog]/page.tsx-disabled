

//import '../../src/styles/Article.css';

type BlogPost = {
  path: string;
  image: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  hidden?: boolean;
};

import { notFound } from 'next/navigation';

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const fileList: BlogPost[] = (await import('../../../public/markdown/_files_list.json')).default ?? [];
  const post = fileList.find(post => post.path === params.slug && !post.hidden);
  if (!post) return notFound();

  let content = '';
  try {
    content = (await import(`../../../public/markdown/${post.path}.md`)).default ?? '';
  } catch {
    return notFound();
  }

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <div className="text-gray-500 mb-4">By {post.author} on {post.date}</div>
      <img src={`/blog-images/${post.image}`} alt={post.title} width={800} height={400} className="rounded mb-6" />
      <article className="prose prose-lg dark:prose-invert">
        {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
      </article>
      <div className="mt-8">
        <span className="text-sm text-gray-400">Tags: {post.tags.join(', ')}</span>
      </div>
    </main>
  );
}
