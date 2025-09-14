import fs from 'node:fs';
import path from 'node:path';
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Markdown from 'react-markdown';
import CommentList from './comment-list';
import blogsList from '@/private/markdown/_files_list.json';
import '@/private/styles/Article.css';

type Props = {
  params: Promise<{ blog: string }>;
}

type BlogPost = {
  path: string;
  image: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  hidden?: boolean;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog } = await params;
  const blogData: BlogPost | undefined = blogsList.find((post) => post.path === blog);

  if (!blogData) return {};
  return {
    title: blogData?.title,
    description: 'Read the blog post titled ' + blogData?.title,
    openGraph: {
      type: 'article',
      url: 'https://amin394t.github.io/Personal-Blog/?blog=' + blogData?.path,
      title: blogData?.title,
      description: 'Read the blog post titled ' + blogData?.title,
      images: [{ url: 'https://amin394t.github.io/Personal-Blog/images/' + blogData?.image }],
    },
  };
}


export default async function Article({ params }: Props) {
  const { blog } = await params;
  const blogData: BlogPost | undefined = blogsList.find((post) => post.path === blog);

  if (!blogData)
    return notFound();
    
  const markdownPath = path.join(process.cwd(), 'private', 'markdown');
  const data = fs.readFileSync(markdownPath + `/${blogData.path}.md`, 'utf-8');
  // improve by using importAll

  return (
    <>
      <div className="article">      
        <div className="article-image" style={{backgroundImage: `linear-gradient(rgba(245, 239, 230, 0.2), rgba(245, 239, 230, 1)), url(/images/${blogData.image})`}}>
          <h1>{blogData.title}</h1>

          <div className="article-info" >  
            <Link href={`/?search=${blogData.tags[0]}`}>📘 &nbsp;{blogData.tags[0]}</Link>
            <Link href={`/?search=${blogData.author}`}>🖊️ &nbsp;{blogData.author}</Link>
            <span>🕓 &nbsp;{blogData.date}</span>
          </div>
        </div>

        <Markdown>{data}</Markdown>

        <span className="article-tags">
          { blogData.tags.map((tag: string) => <Link key={tag} href={`/?search=${tag}`}>&#35; {tag}</Link>) }
        </span>
      </div>
    
      <CommentList {...{ parent: blogData.path }} />
    </>
  );
}