'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Comment } from "./types";
import CommentEditor from "./comment-editor";


function CommentCard({ comment }: { comment: Comment }) {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => { 
        setUsername(localStorage.getItem('username'));
        setPassword(localStorage.getItem('password'));
    }, [comment]);


    let handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Delete this comment?');
        if (!confirmDelete) return;

        const request = await fetch(`${window.location.origin}/api/comments`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, username, password })
        });
        const response = await request.json();

        if (request.ok)
            router.refresh();
        else if (response.code == 60)
            alert("Technical Error!");
        else
            alert(response.message);
    };

    if (editing)
        return (<CommentEditor id={comment.id} content={comment.content} show={setEditing} mode="update" />);

    return (
        <div className="comment-card">
            <div className="comment-user">
                💬 &nbsp; {comment.user}
                {
                    comment.user == username &&
                    <span>
                        <span className="comment-modify" onClick={() => setEditing(true)} title="Modify"> 📋 </span>
                        <span className="comment-delete" onClick={() => handleDelete(comment.id)} title="Delete"> 🗑️ </span>
                    </span>
                }
            </div>
            <div className="comment-text">{comment.content}</div>
        </div>
    )
}

export default CommentCard;