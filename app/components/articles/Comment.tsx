import React, { useState } from "react";
import Image from "next/image";
import { defaultImage } from "@/utils/mapper";
import Link from "next/link";
import { CommentResponse, SafeUser } from "@/types/user";
import { formatDate } from "@/utils/formatDate";
import axios from "axios";
import { useParams } from "next/navigation";

type Props = {
  comment: CommentResponse;
  currentUser: SafeUser | null;
  setComments: (comment: any) => void;
};

const Comment = ({ comment, currentUser, setComments }: Props) => {
  const params = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteComment = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `/api/articles/${params?.slug}/comments/${id}`
      );
      if (response.status === 200) {
        setComments((prevComments: CommentResponse[]) =>
          prevComments.filter((item: CommentResponse) => item.id !== id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-block">
          <p className="card-text">{comment.body}</p>
        </div>
        <div className="card-footer flex items-center justify-between">
          <div>
            <Link href="/profile/author" className="comment-author">
              <Image
                src={comment.author.image || defaultImage}
                className="comment-author-img"
                alt="avatar"
                height={100}
                width={100}
              />
            </Link>
            &nbsp;
            <Link
              href={`/profile/${comment.author.username}`}
              className="comment-author"
            >
              {comment.author.username}
            </Link>
            <span className="date-posted">{formatDate(comment.createdAt)}</span>
          </div>
          {comment.author.username === currentUser?.username && (
            <>
              <button
                className="ml-52 btn btn-sm btn-danger"
                onClick={() => handleDeleteComment(comment.id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;
