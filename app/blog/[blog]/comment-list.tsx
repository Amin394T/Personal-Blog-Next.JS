'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommentEditor from "./comment-editor";
import "@/private/styles/Comments.css";

export type Comment = {
  id: number;
  user: string;
  date: string;
  content: string;
  parent: string | number;
  status: "normal" | "edited" | "removed" | "orphan" | "blocked";
};

const COMMENT_API_URL = 'http://localhost:3001/api';



export default async function CommentList({ parent }: { parent: string | number }) {
  const [comments, setComments] = useState(new Array<Comment>());
  const [showEditor, setShowEditor] = useState(0);
  const [content, setContent] = useState('');
  const params = useParams();
  const fetchData = await (await fetch(`${COMMENT_API_URL}/messages/${parent}`)).json();  
  // read API URL from .env

  const isReply = params?.blog != parent;
  
  useEffect(() => {
    if (fetchData)
      setComments(fetchData);
  }, [fetchData]);

  // if (fetchStatus == "loading")
  //   return (<div className="spinner comments"> <div></div> </div>);
  // if (fetchStatus == "error")
  //   return null;


  let handleModify = (comment: Comment) => {
    setContent(comment.content);
    setShowEditor(comment.id);
  };

  let handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Delete this comment?');
    if (!confirmDelete) return;

    const request = await fetch(`${COMMENT_API_URL}/messages/${id}`, {
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
      { !isReply && <CommentEditor {...{id: parent, content: "", setComments, setShowEditor, mode: "create"}} /> }
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
            
            { showEditor == comment.id && <CommentEditor {...{id: comment.id, content, setComments, setShowEditor, mode: "update"}} /> }
            { !isReply && <CommentList parent={comment.id} /> }   
          </div>
        )
      }
      {
        showEditor != 0
          ? <CommentEditor {...{id: parent, content: "", setComments, setShowEditor, mode: "create"}} /> 
          : isReply && <button onClick={() => setShowEditor(-1)}> Reply </button>
      }
    </div>
  );
}