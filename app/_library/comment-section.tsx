import { Suspense } from "react";
import CommentEditor from "./comment-editor";
import CommentCard from "./comment-card";
import { createComment, fetchComments } from "@/database/actions";
import type { Comment } from "./types";
import "@/private/styles/Comments.css";


export default async function CommentSection({ blog }: { blog: string }) {
  const comments: any = await fetchComments(blog);
  if (comments.code == 40)
    throw new Error("Failed to fetch comments.");
  
  return (
    <div className="comment-section">
      <form action={createComment}>
        <CommentEditor id={blog} mode="create" show={true} />
      </form>
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
