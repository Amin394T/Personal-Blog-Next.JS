'use client';
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type { Comment } from "./comment-list";
import "@/private/styles/Editor.css";

type Props = {
  id: number | string;
  content?: string;
  setComments: any; //(comments: Comment[] | ((comment: any) => Comment[])) => void;
  setShowEditor: any; //(id: number) => void;
  mode: "create" | "update";
};

const API_URL = process.env.NEXT_PUBLIC_COMMENT_API_URL;


export default function CommentEditor({ id, content, setComments, setShowEditor, mode }: Props) {
  const editorRef: any = useRef(null);
  const usernameRef: any = useRef(null);
  const passwordRef: any = useRef(null);
  const [processing, setProcessing] = useState(false);
  const params = useParams();

  useEffect(() => {
    editorRef.current.value = content ?? '';
    usernameRef.current.value = localStorage.getItem("username") ?? '';
    passwordRef.current.value = localStorage.getItem("password") ?? '';
  }, [content]);

  let handleStretchArea = () => {
    editorRef.current.style.height = "0";
    editorRef.current.style.height = editorRef.current.scrollHeight + "px";
  };

  let handleClearComment = () => {
    editorRef.current.value = "";
    handleStretchArea();
    setShowEditor(0);
  };

  let handleRegistration = async (username: string, password: string) => {
    const confirmCreateUser = window.confirm("Create a new Account?");
    if (!confirmCreateUser) {
      alert("Account Creation Required!");
      return;
    }

    const request = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const response = await request.json();

    if (response.code == 19)
      handleSubmit();
    else if (response.code == 10)
      alert("Technical Error!");
    else
      alert(response.message);
  }

  let handleSubmit = async () => {
    if (processing) return;
    setProcessing(true);
    setTimeout(() => {}, 3000);

    const username = usernameRef.current.value.trim();
    const password = passwordRef.current.value;
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    if (mode == "create") {

      const request = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          content: editorRef.current.value,
          parent: id.toString()
        })
      });
      const response = await request.json();

      if (response.code == 39) {
        params?.blog == id.toString()
          ? setComments((prevComments: Comment[]) => [response, ...prevComments])
          : setComments((prevComments: Comment[]) => [...prevComments, response]);
        handleClearComment();
      }
      else if (response.code == 31 && username)
        handleRegistration(username, password);
      else if (response.code == 30)
        alert("Technical Error!");
      else
        alert(response.message);
    }

    else if (mode == "update") {

      const request = await fetch(`${API_URL}/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          content: editorRef.current.value
        })
      });
      const response = await request.json();

      if (response.code == 59) {
        setComments((prevComments: Comment[]) => (
          prevComments.map((comment: Comment) => comment.id == id ? { ...comment, content: response.content } : comment)
        ));
        handleClearComment();
      }
      else if (response.code == 50)
        alert("Technical Error!");
      else
        alert(response.message);
    }
    setProcessing(false);
  };


  return (
    <div className="editor" key={id}>
      <textarea placeholder="Write a comment ..." ref={editorRef} onChange={handleStretchArea} />
      <div className="editor-authentication" style={{ visibility: mode == "update" ? "hidden" : "visible" }}>
        <input ref={usernameRef} type="text" placeholder="Username" />
        <input ref={passwordRef} type="password" placeholder="Password" />
      </div>
      <div className="editor-controls">
        <button onClick={handleClearComment}>Cancel</button>
        <button onClick={handleSubmit} disabled={processing}>Submit</button>
      </div>
    </div>
  );
}