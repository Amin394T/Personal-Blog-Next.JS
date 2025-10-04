'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "@/private/styles/Editor.css";

type Props = {
  id: number | string;
  content?: string;
  show: boolean | ((value: boolean) => void);
  mode: "create" | "update";
};


export default function CommentEditor({ id, content, show, mode }: Props) {
  const editorRef: any = useRef(null);
  const usernameRef: any = useRef(null);
  const passwordRef: any = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [visible, setVisible] = useState(show ? true : false);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      editorRef.current.value = content ?? '';
      usernameRef.current.value = localStorage.getItem("username") ?? '';
      passwordRef.current.value = localStorage.getItem("password") ?? '';
    }
  }, [visible]);
  

  let handleStretchArea = () => {
    editorRef.current.style.height = "0";
    editorRef.current.style.height = editorRef.current.scrollHeight + "px";
  };

  let handleClearComment = () => {
    if (mode == "update" && typeof show === "function")
      show(false);
    else {
      editorRef.current.value = "";
      handleStretchArea();
      typeof id === "number" && setVisible(false);
    }
  };

  let handleRegistration = async (username: string, password: string) => {
    const confirmCreateUser = window.confirm("Create a new Account?");
    if (!confirmCreateUser) {
      alert("Account Creation Required!");
      return;
    }

    const request = await fetch(`${window.location.origin}/api/users/register`, {
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
    const content = editorRef.current.value.trim();
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    if (mode == "create") {

      const request = await fetch(`${window.location.origin}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, content, parent: id.toString() })
      });
      const response = await request.json();

      if (response.code == 39) {
        router.refresh();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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

      const request = await fetch(`${window.location.origin}/api/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username, password, content })
      });
      const response = await request.json();

      if (response.code == 59) {
        router.refresh();
        handleClearComment();
      }
      else if (response.code == 50)
        alert("Technical Error!");
      else
        alert(response.message);
    }
    
    setProcessing(false);
  };


  if (!visible)
    return <button className="editor-toggle" onClick={() => setVisible(true)}> Reply </button>;

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