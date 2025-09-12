import { useEffect, useState } from "react";
import "../styles/Comments.css";
import useFetch from "../utilities/useFetch";
import Editor from "./Editor";

function Comments({ parent }) {
  const [comments, setComments] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [content, setContent] = useState(null);
  const { data: fetchData, status: fetchStatus } = useFetch(`${import.meta.env.VITE_API_URL}/messages/${parent}`, false);  

  const isReply = new URLSearchParams(window.location.search).get("blog") != parent;
  
  useEffect(() => {
    if (fetchData)
      setComments(JSON.parse(fetchData));
  }, [fetchData]);

  if (fetchStatus == "loading")
    return (<div className="spinner comments"> <div></div> </div>);
  if (fetchStatus == "error")
    return null;


  let handleModify = (comment) => {
    setContent(comment.content);
    setShowEditor(comment.id);
  };

  let handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this comment?');
    if (!confirmDelete) return;

    const request = await fetch(`${import.meta.env.VITE_API_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password')
      }),
    });
    const response = await request.json();

    if (request.ok)
      setComments(comments.filter((comment) => comment.id != id));
    else if (response.code == 60)
      alert("Technical Error!");
    else
      alert(response.message);
  };


  return (
    <div className="comments">
      { !isReply && <Editor {...{id: parent, setComments, setShowEditor, mode: "create"}} /> }
      {
        comments.map((comment) =>
          <div className="comments-list" key={comment.id} title={new Date(comment.date).toLocaleString().concat(comment.status == "edited" ? " (edited)" : "")}>
            <div className="comment">
              <div className="comment-user">
                💬 &nbsp; {comment.user}
                { 
                  comment.user == localStorage.getItem('username') &&
                  <span>
                    <span className="comment-modify" onClick={() => handleModify(comment)} title="Modify"> 📋 </span>
                    <span className="comment-delete" onClick={() => handleDelete(comment.id)} title="Delete"> 🗑️ </span>
                  </span>
                }
              </div>
              <div className="comment-text">{comment.content}</div>
            </div>
            
            { showEditor == comment.id && <Editor {...{id: comment.id, content, setComments, setShowEditor, mode: "update"}} /> }
            { !isReply && <Comments parent={comment.id} /> }   
          </div>
        )
      }
      {
        showEditor == true
          ? <Editor {...{id: parent, setComments, setShowEditor, mode: "create"}} /> 
          : isReply && <button onClick={() => setShowEditor(true)}> Reply </button>
      }
    </div>
  );
}

export default Comments;