"use client";
import { useRouter } from "next/navigation";
import type { Comment } from "./types";



function CommentCard({ comment }: { comment: Comment }) {
    const router = useRouter();

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
            body: JSON.stringify({
                id,
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password')
            }),
        });
        const response = await request.json();

        if (request.ok)
            //setComments(comments.filter((comment) => comment.id != id));
            router.refresh();
        else if (response.code == 60)
            alert("Technical Error!");
        else
            alert(response.message);
    };

    return (
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
    )
}

export default CommentCard;