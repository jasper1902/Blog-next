"use client";
import { ArticleResponse, SafeUser } from "@/types/user";
import { updateFavorite } from "@/utils/articlesUtils";
import { formatDate } from "@/utils/formatDate";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { defaultImage } from "@/utils/mapper";
import Link from "next/link";
import PostComment from "@/app/components/articles/PostComment";
import Comments from "@/app/components/articles/CommentsList";
import useToggleFollowStatus from "@/app/hooks/useToggleFollowStatus";

type Props = {
  currentUser: SafeUser | null;
};

const ArticleDetail = ({ currentUser }: Props) => {
  const params = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [favorited, setFavorited] = useState<boolean>(false);
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
        setFavorited(response.data.article.favorited);
        setFavoritesCount(response.data.article.favoritesCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!article) {
    return <></>;
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
                onClick={() =>
                  following
                    ? toggleFollowStatus("unfollow", currentUser?.username)
                    : toggleFollowStatus("follow", currentUser?.username)
                }
              >
                <i className="ion-plus-round"></i>
                &nbsp; {following ? "unfollow" : "follow"}{" "}
                {article.author.username} <span className="counter"></span>
              </button>
              &nbsp;&nbsp;
              <button
                className={`btn ${
                  favorited
                    ? "btn-sm btn-primary"
                    : "btn-sm btn-outline-primary"
                }`}
                disabled={isLoading}
                onClick={() =>
                  favorited
                    ? updateFavorite(
                        article.slug,
                        setFavoritesCount,
                        favoritesCount,
                        setFavorited,
                        setIsLoading,
                        "remove"
                      )
                    : updateFavorite(
                        article.slug,
                        setFavoritesCount,
                        favoritesCount,
                        setFavorited,
                        setIsLoading,
                        "add"
                      )
                }
              >
                <i className="ion-heart"></i>
                &nbsp; Favorite Post{" "}
                <span className="counter">({favoritesCount})</span>
              </button>
              {currentUser?.username === article.author.username && (
                <>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-edit"></i> Edit Article
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
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
                onClick={() =>
                  following
                    ? toggleFollowStatus("unfollow", currentUser?.username)
                    : toggleFollowStatus("follow", currentUser?.username)
                }
              >
                <i className="ion-plus-round"></i>
                &nbsp; {following ? "unfollow" : "follow"}{" "}
                {article.author.username}
              </button>
              &nbsp;
              <button
                className={`btn btn-sm ${
                  favorited
                    ? "btn-sm btn-primary"
                    : "btn-sm btn-outline-primary"
                }`}
                disabled={isLoading}
                onClick={() =>
                  favorited
                    ? updateFavorite(
                        article.slug,
                        setFavoritesCount,
                        favoritesCount,
                        setFavorited,
                        setIsLoading,
                        "remove"
                      )
                    : updateFavorite(
                        article.slug,
                        setFavoritesCount,
                        favoritesCount,
                        setFavorited,
                        setIsLoading,
                        "add"
                      )
                }
              >
                <i className="ion-heart"></i>
                &nbsp; Favorite Article{" "}
                <span className="counter">({favoritesCount})</span>
              </button>
              {currentUser?.username === article.author.username && (
                <>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-edit"></i> Edit Article
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
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
