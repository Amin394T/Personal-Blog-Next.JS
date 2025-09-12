import "../styles/Feed.css";

function Feed({ blogsList, handleSelection, searchWord }) {
  if (searchWord)
    document.title = `Searching : "${searchWord}"`;

  const filteredBlogs = blogsList.filter((blog) =>
    !blog?.hidden &&
    (
      blog.tags.some((tag) => tag.toLowerCase().includes(searchWord)) ||
      blog.title.toLowerCase().includes(searchWord) ||
      blog.author.toLowerCase() == searchWord
    )
  );
  const sortedBlogs = filteredBlogs.sort((blog1, blog2) => new Date(blog2.date) - new Date(blog1.date));

  return (
    <div className="feed">
      { sortedBlogs.map((blog) =>

        <div className="feed-blog" key={blog.path} onClick={() => handleSelection(blog.path)}>
          <span>{blog.tags[0]}</span>
          <img src={`./images/${blog.image || "_placeholder.png"}`} />
          <div>{blog.title}</div>
        </div>
      
      )}
    </div>
  );
}

export default Feed;
