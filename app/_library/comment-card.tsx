'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Comment } from "./types";
import CommentEditor from "./comment-editor";
import { deleteComment } from "@/database/actions";


function CommentCard({ comment }: { comment: Comment }) {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [editing, setEditing] = useState(false);

    useEffect(() => { 
        setUsername(localStorage.getItem('username') || '');
        setPassword(localStorage.getItem('password') || '');
    }, [comment]);


    let handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Delete this comment?');
        if (!confirmDelete) return;

        const action = await deleteComment(id.toString(), username, password);

        if (action.code == 69)
            router.refresh();
        else if (action.code == 60)
            alert("Technical Error!");
        else
            alert(action.message);
    };

    
    if (editing)
        return (<CommentEditor id={comment.id} content={comment.content} show={setEditing} mode="update" />);

    return (
        <div className="comment-card">
            <div className="comment-user" title={ new Date(comment.date).toLocaleString('en-UK') + ` (${comment.status})` }>
                💬 &nbsp; {comment.user}
                {
                    comment.user == username
                    ? <span>
                        <span className="comment-modify" onClick={() => setEditing(true)} title="Modify"> 📋 </span>
                        <span className="comment-delete" onClick={() => handleDelete(comment.id)} title="Delete"> 🗑️ </span>
                      </span>
                    : <span className="comment-date"> { new Date(comment.date).toLocaleDateString('en-UK') } </span>
                }
            </div>
            <div className="comment-text">{comment.content}</div>
        </div>
    )
}

export default CommentCard;