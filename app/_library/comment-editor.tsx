'use client';
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createComment, updateComment, registerUser } from "@/database/actions";
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
  const [visible, setVisible] = useState(show ? true : false);
  const router = useRouter();
  const { pending } = useFormStatus();
  
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
    if (mode == "update" && typeof show == "function")
      show(false);
    else {
      editorRef.current.value = "";
      handleStretchArea();
      typeof id == "number" && setVisible(false);
    }
  };

  let handleRegistration = async (username: string, password: string, event: React.FormEvent) => {
    const confirmCreateUser = window.confirm("Create a new Account?");
    if (!confirmCreateUser) {
      alert("Account Creation Required!");
      return;
    }

    const action = await registerUser(username, password);

    if (action.code == 19)
      handleSubmit(event);
    else if (action.code == 10)
      alert("Technical Error!");
    else
      alert(action.message);
  }

  let handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const username = usernameRef.current.value.trim();
    const password = passwordRef.current.value;
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    if (mode == "create") {
      const action = await createComment(formData);
      
      if (action.code == 39) {
        router.refresh();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        handleClearComment();
      }
      else if (action.code == 31 && username)
        // TODO: fix event being empty
        handleRegistration(username, password, event);
      else if (action.code == 30)
        alert("Technical Error!");
      else
        alert(action.message);
    }

    else if (mode == "update") {
      const action = await updateComment(id.toString(), formData);

      if (action.code == 59) {
        router.refresh();
        handleClearComment();
      }
      else if (action.code == 50)
        alert("Technical Error!");
      else
        alert(action.message);
    }
  }


  if (!visible)
    return <button className="editor-toggle" onClick={() => setVisible(true)}> Reply </button>;

  return (
    <form onSubmit={handleSubmit} className="editor" key={id}>
      <textarea name="content" placeholder="Write a comment ..." ref={editorRef} onChange={handleStretchArea} />

      <div className="editor-authentication" style={ mode == "update" ? { height: 0, visibility: "hidden" } : {} }>
        <input name="username" ref={usernameRef} type="text" placeholder="Username" />
        <input name="password" ref={passwordRef} type="password" placeholder="Password" />
      </div>

      <input type="hidden" name="parent" value={id} />

      <div className="editor-controls">
        <button onClick={handleClearComment}>Cancel</button>
        <button type="submit" disabled={pending}>Submit</button>
      </div>
    </form>
  );
}