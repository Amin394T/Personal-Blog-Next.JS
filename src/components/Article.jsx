import "../styles/Article.css";
import useFetch from "../utilities/useFetch";
import Markdown from "react-markdown";

function Article({ blogData, handleSearch }) {
  const { data, status } = useFetch(`./markdown/${blogData?.path}.md`);

  if (status == "loading")
    return (<div className="spinner article"> <div></div> </div>);
  if (status == "error" || !blogData)
    return (<div className="error article"> <div>&#x2716;</div> Oops! Something went wrong. </div>);

  document.title = blogData.title;
  
  return (
    <div className="article">      
      <div className="article-image" style={{backgroundImage: `linear-gradient(rgba(245, 239, 230, 0.2), rgba(245, 239, 230, 1)), url(./images/${blogData.image})`}}>
        <h1>{blogData.title}</h1>

        <div className="article-info" >  
          <span>📘 &nbsp;{blogData.tags[0]}</span>
          <span className="article-author" onClick={() => handleSearch(blogData.author)}>🖊️ &nbsp;{blogData.author}</span>
          <span>🕓 &nbsp;{blogData.date}</span>
        </div>
      </div>

      <Markdown>{data}</Markdown>
      
      <span className="article-tags">
        { blogData.tags.map((tag) => <span key={tag} onClick={() => handleSearch(tag)}>&#35; {tag}</span>) }
      </span>
    </div>
  );
}

export default Article;