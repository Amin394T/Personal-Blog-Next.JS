import fs from 'node:fs';
import path from 'node:path';
import { Metadata } from "next";
import '../../../src/styles/Article.css';
import { BlogPost } from '../../page';

type Props = {
  params: Promise<{ blog: string }>;
}

const markdownDir = path.join(process.cwd(), 'private', 'markdown');
const blogsList: BlogPost[] = JSON.parse(fs.readFileSync(markdownDir + '/_files_list.json', 'utf-8'));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog } = await params;
  const blogData: BlogPost | undefined = blogsList.find((post) => post.path === blog);

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

    const data = fs.readFileSync(markdownDir + `/${blogData.path}.md`, 'utf-8');

    return (
      <div className="article">      
        <div className="article-image" style={{backgroundImage: `linear-gradient(rgba(245, 239, 230, 0.2), rgba(245, 239, 230, 1)), url(/images/${blogData.image})`}}>
          <h1>{blogData.title}</h1>
  
          <div className="article-info" >  
            <span>📘 &nbsp;{blogData.tags[0]}</span>
            <span className="article-author">🖊️ &nbsp;{blogData.author}</span>
            <span>🕓 &nbsp;{blogData.date}</span>
          </div>
        </div>

        {data}

        <span className="article-tags">
          { blogData.tags.map((tag: string) => <span key={tag}>&#35; {tag}</span>) }
        </span>
      </div>
    );
  }
// author and tag search

export default Article;