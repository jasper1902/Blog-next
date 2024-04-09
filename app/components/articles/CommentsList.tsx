import React, { Fragment, useEffect, useState } from "react";

import PostComment from "./PostComment";
import { useParams } from "next/navigation";
import { CommentResponse, SafeUser } from "@/types/user";
import Comment from "./Comment";
import axios from "axios";
import Link from "next/link";

type Props = {
  currentUser: SafeUser | null;
};

const Comments = ({ currentUser }: Props) => {
  const params = useParams<{ slug: string }>();
  const [comments, setComments] = useState<CommentResponse[] | null>(null);
  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getComments = async () => {
    try {
      const response = await axios.get(
        `/api/articles/${params?.slug}/comments`
      );
      if (response.status === 200) {
        setComments(response.data.comments);
      }
    } catch (error) {}
  };

  return (
    <>
      {currentUser ? (
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <PostComment
              currentUser={currentUser}
              slug={params?.slug}
              setComments={setComments}
            />

            {comments?.map((comment: CommentResponse) => (
              <Fragment key={comment.id}>
                <Comment
                  comment={comment}
                  currentUser={currentUser}
                  setComments={setComments}
                />
              </Fragment>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-xl text-bold">
          <Link href="/login">Sign in</Link> or{" "}
          <Link href="/register">sign up</Link> to add comments on this article.
        </p>
      )}
    </>
  );
};

export default Comments;
