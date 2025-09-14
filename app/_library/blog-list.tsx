import Link from "next/link";
import blogsList from '@/private/markdown/_files_list.json';
import '@/private/styles/Feed.css';


export default async function BlogList({ query }: { query: string | undefined }) {
  query = query?.toLowerCase() ?? '';
    
  let filteredBlogs = blogsList.filter(blog => !blog.hidden);
  filteredBlogs = filteredBlogs.filter(blog =>
    blog.tags.some(tag => tag.toLowerCase().includes(query)) ||
    blog.title.toLowerCase().includes(query) ||
    blog.author.toLowerCase().includes(query)
  );
  const sortedBlogs = filteredBlogs.sort((blog1, blog2) => new Date(blog2.date).getTime() - new Date(blog1.date).getTime());

  return (
    <div className="feed">
      {sortedBlogs.map(blog => (
        <Link href={`/blog/${blog.path}`} key={blog.path} className="feed-blog">
          <span>{blog.tags[0]}</span>
          <img src={`/images/${blog.image || '_placeholder.png'}`} alt={blog.title} />
          <div>{blog.title}</div>
        </Link>
      ))}
    </div>
  );
}