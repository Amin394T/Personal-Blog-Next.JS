import path from "path";
import fs from "fs";
import Link from "next/link";
import '../../private/styles/Feed.css';

export type BlogPost = {
  path: string;
  image: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  hidden?: boolean;
};

export default function BlogList({ searchParams }: { searchParams?: { search?: string } }) {
    const markdownPath = path.join(process.cwd(), 'private', 'markdown');
      const blogsList: BlogPost[] = JSON.parse(fs.readFileSync(markdownPath + '/_files_list.json', 'utf-8'));

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
        <div className="feed">
        {filteredBlogs.map(blog => (
          <Link href={`/blog/${blog.path}`} key={blog.path} className="feed-blog">
            <span>{blog.tags[0]}</span>
            <img src={`/images/${blog.image || '_placeholder.png'}`} alt={blog.title} />
            <div>{blog.title}</div>
          </Link>
        ))}
      </div>
    );
}