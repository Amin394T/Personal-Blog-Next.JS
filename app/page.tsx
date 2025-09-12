import fs from 'fs';
import path from 'path';
import Image from 'next/image';

import '../src/styles/Navigation.css';
import '../src/styles/Feed.css';

export type BlogPost = {
  path: string;
  image: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  hidden?: boolean;
};

type Welcome = {
  name: string;
  heading: string;
  line_1: string;
  line_2: string;
  line_3: string;
};

function getQueryParam(param: string): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(param) ?? '';
}

export default async function Home({ searchParams }: { searchParams?: { search?: string } }) {
  const fileListPath = path.join(process.cwd(), 'public/markdown/_files_list.json');
  const welcomePath = path.join(process.cwd(), 'public/markdown/_welcome.json');
  const blogsList: BlogPost[] = JSON.parse(fs.readFileSync(fileListPath, 'utf-8'));
  const welcome: Welcome = JSON.parse(fs.readFileSync(welcomePath, 'utf-8'));

  const searchWord = searchParams?.search?.toLowerCase() ?? '';
  let filteredBlogs = blogsList.filter(blog => !blog.hidden);
  if (searchWord) {
    filteredBlogs = filteredBlogs.filter(blog =>
      blog.tags.some(tag => tag.toLowerCase().includes(searchWord)) ||
      blog.title.toLowerCase().includes(searchWord) ||
      blog.author.toLowerCase() === searchWord
    );
  }
  filteredBlogs = filteredBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">

      {!searchWord && (
        <div className="article">
          <h1>{welcome.heading}</h1>
          <p>{welcome.line_1}</p>
          <p>{welcome.line_2}</p>
          <p>{welcome.line_3}</p>
        </div>
      )}

      <div className="feed">
        {filteredBlogs.map(blog => (
          <a href={`/blog/${blog.path}`} key={blog.path} className="feed-blog" style={{display: 'block', marginBottom: 24, cursor: 'pointer'}}>
            <span>{blog.tags[0]}</span>
            <Image src={`/images/${blog.image || '_placeholder.png'}`} alt={blog.title} width={120} height={80} style={{borderRadius: 8}} />
            <div>{blog.title}</div>
          </a>
        ))}
      </div>
    </main>
  );
}


