import { CommentResponse, SafeUser } from "@/types/user";
import React, { useState } from "react";
import Image from "next/image";
import { defaultImage } from "@/utils/mapper";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Textarea from "../input/Textarea";
import { useRouter } from "next/navigation";
type Props = {
  currentUser: SafeUser | null;
  slug: string | undefined;
  setComments: (comment: any) => void;
};

const PostComment = ({ currentUser, slug, setComments }: Props) => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      body: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      if (data.body === "") return;
      if (typeof slug !== "undefined") {
        const response = await axios.post(`/api/articles/${slug}/comments`, {
          comment: data,
        });
        if (response.status === 200) {
          setComments((prevComment: any) => [
            response.data.comments,
            ...prevComment,
          ]);
          reset();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {currentUser && (
        <>
          <form className="card comment-form">
            <div className="card-block">
              <Textarea
                id="body"
                register={register}
                placeholder="Write a comment..."
                rows={3}
              ></Textarea>
            </div>
            <div className="card-footer">
              <Image
                src={currentUser.image || defaultImage}
                className="comment-author-img"
                alt="avatar"
                width={100}
                height={100}
              />

              <button
                className="btn btn-sm btn-primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                Post Comment
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default PostComment;
