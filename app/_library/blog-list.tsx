import Link from "next/link";
import '@/private/styles/Feed.css';
import blogsList from '@/private/markdown/_files_list.json';


export type BlogPost = {
  path: string;
  image: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  hidden?: boolean;
};


export default async function BlogList({ query }: { query: string | undefined }) {
    query = query?.toLowerCase() ?? '';
    let filteredBlogs = blogsList.filter(blog => !blog.hidden);
    if (query) {
        filteredBlogs = filteredBlogs.filter(blog =>
            blog.tags.some(tag => tag.toLowerCase().includes(query)) ||
            blog.title.toLowerCase().includes(query) ||
            blog.author.toLowerCase().includes(query)
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