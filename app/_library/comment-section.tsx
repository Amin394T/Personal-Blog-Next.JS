import { Suspense } from "react";
import CommentEditor from "./comment-editor";
import CommentCard from "./comment-card";
import type { Comment } from "./types";
import "@/private/styles/Comments.css";


export default async function CommentSection({ blog }: { blog: string }) {

  const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/comments/${blog}`, { cache: 'no-store' });
  if (!data.ok)
    throw new Error("Failed to fetch comments.");
  const comments = await data.json();

  return (
    <div className="comment-section">
      <CommentEditor id={blog} mode="create" show={true} />
      {
        comments.map((comment: Comment) =>
          <div className="comment-thread" key={comment.id}>
            <Suspense fallback={<div className="spinner comment-card"> <div></div> </div>}>
              
              <CommentCard comment={comment} />
              <div className="comment-replies">
                {
                  comment.replies && comment.replies.map((reply: Comment) =>
                    <CommentCard key={reply.id} comment={reply} />
                  )
                }
              </div>

            </Suspense>
            <CommentEditor id={comment.id} mode="create" show={false} />
          </div>
        )
      }
    </div>
  );
}
