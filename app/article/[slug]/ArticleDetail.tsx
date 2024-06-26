"use client";
import { ArticleResponse, SafeUser } from "@/types/user";
import { formatDate } from "@/utils/formatDate";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { defaultImage } from "@/utils/mapper";
import Link from "next/link";
import Comments from "@/app/components/articles/CommentsList";
import useToggleFollowStatus from "@/app/hooks/useToggleFollowStatus";
import FavoriteButton from "@/app/components/articles/FavoriteButton";

type Props = {
  currentUser: SafeUser | null;
};

const ArticleDetail = ({ currentUser }: Props) => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean | null | undefined>(null);
  const { isFollowLoading, currentFollowing, toggleFollowStatus } =
    useToggleFollowStatus();

  useEffect(() => {
    getArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFollowing(article?.author.following);
  }, [article?.author.following]);

  useEffect(() => {
    setFollowing(currentFollowing);
  }, [currentFollowing]);

  const getArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${params?.slug}`);
      if (response.status === 200) {
        setArticle(response.data.article);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteArticle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/articles/${article?.slug}`);
      if (response.status === 200) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFollow = () => {
    following
      ? toggleFollowStatus("unfollow", currentUser?.username)
      : toggleFollowStatus("follow", currentUser?.username);
  };

  if (!article) {
    return <>No article...</>;
  }

  return (
    <>
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article?.title}</h1>

            <div className="article-meta">
              <Link href={`/profile/${article?.author.username}`}>
                <Image
                  src={article?.author.image || defaultImage}
                  alt="avatar"
                  width={100}
                  height={100}
                />
              </Link>
              <div className="info">
                <a
                  href={`/profile/${article?.author.username}`}
                  className="author"
                >
                  {article?.author.username}
                </a>
                <span className="date">{formatDate(article?.createdAt)}</span>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={isFollowLoading}
                onClick={handleToggleFollow}
              >
                <i className="ion-plus-round"></i>
                &nbsp; {following ? "unfollow" : "follow"}{" "}
                {article.author.username} <span className="counter"></span>
              </button>
              &nbsp;&nbsp;
              <FavoriteButton
                article={article}
                currentUser={currentUser}
                title="&nbsp; Favorite Post"
              />
              {currentUser?.username === article.author.username && (
                <>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-edit"></i> Edit Article
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={deleteArticle}
                    disabled={isLoading}
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <p>{article.body}</p>
              <ul className="tag-list">
                {article.tagList.map((tag) => (
                  <Fragment key={tag}>
                    <li className="tag-default tag-pill tag-outline">{tag}</li>
                  </Fragment>
                ))}
              </ul>
            </div>
          </div>

          <hr />

          <div className="article-actions">
            <div className="article-meta">
              <Link href={`/profile/${article.author.username}`}>
                <Image
                  src={article.author.image || defaultImage}
                  alt="avatar"
                  width={100}
                  height={100}
                />
              </Link>
              <div className="info">
                <a
                  href={`/profile/${article.author.username}`}
                  className="author"
                >
                  {article.author.username}
                </a>
                <span className="date">{formatDate(article?.createdAt)}</span>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={isFollowLoading}
                onClick={handleToggleFollow}
              >
                <i className="ion-plus-round"></i>
                &nbsp; {following ? "unfollow" : "follow"}{" "}
                {article.author.username}
              </button>
              &nbsp;
              <FavoriteButton
                article={article}
                currentUser={currentUser}
                title="&nbsp; Favorite Post"
              />
              {currentUser?.username === article.author.username && (
                <>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-edit"></i> Edit Article
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={deleteArticle}
                    disabled={isLoading}
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </>
              )}
            </div>
          </div>

          <Comments currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;
