import fs from 'node:fs';
import path from 'node:path';
import { Metadata } from "next";
import Markdown from 'react-markdown';
import { BlogPost } from '../../page'; // move to a types file
import '../../../private/styles/Article.css';
import Link from 'next/link';


type Props = {
  params: Promise<{ blog: string }>;
}

const markdownPath = path.join(process.cwd(), 'private', 'markdown');
const blogsList: BlogPost[] = JSON.parse(fs.readFileSync(markdownPath + '/_files_list.json', 'utf-8'));


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


async function Article({ params }: Props) {
  const { blog } : { blog: string } = await params;
  const blogData: BlogPost | undefined = blogsList.find((post) => post.path === blog);

  if (!blogData)
    return (<div className="error article"> <div>&#x2716;</div> Oops! Something went wrong. </div>);
  const data = fs.readFileSync(markdownPath + `/${blogData.path}.md`, 'utf-8');

  return (
    <div className="article">      
      <div className="article-image" style={{backgroundImage: `linear-gradient(rgba(245, 239, 230, 0.2), rgba(245, 239, 230, 1)), url(/images/${blogData.image})`}}>
        <h1>{blogData.title}</h1>

        <div className="article-info" >  
          <Link href={`/?search=${blogData.tags[0]}`}><span>📘 &nbsp;{blogData.tags[0]}</span></Link>
          <Link href={`/?search=${blogData.author}`}><span className="article-author">🖊️ &nbsp;{blogData.author}</span></Link>
          <span>🕓 &nbsp;{blogData.date}</span>
        </div>
      </div>

      <Markdown>{data}</Markdown>

      <span className="article-tags">
        { blogData.tags.map((tag: string) => <Link key={tag} href={`/?search=${tag}`}><span>&#35; {tag}</span></Link>) }
      </span>
    </div>
  );
}
// author and tag search

export default Article;