'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Comment } from "./types";


function CommentCard({ comment }: { comment: Comment }) {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    useEffect(() => { 
        setUsername(localStorage.getItem('username'));
        setPassword(localStorage.getItem('password'));
    }, [comment]);

    let handleModify = (comment: Comment) => {
        // setContent(comment.content);
        // setShowEditor(comment.id);
    };

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

    return (
        <div className="comment-card">
            <div className="comment-user">
                💬 &nbsp; {comment.user}
                {
                    comment.user == username &&
                    <span>
                        <span className="comment-modify" onClick={() => handleModify(comment)} title="Modify"> 📋 </span>
                        <span className="comment-delete" onClick={() => handleDelete(comment.id)} title="Delete"> 🗑️ </span>
                    </span>
                }
            </div>
            <div className="comment-text">{comment.content}</div>
        </div>
    )
}

export default CommentCard;