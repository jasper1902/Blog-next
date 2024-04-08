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

type Props = {
  currentUser: SafeUser | null;
};

const ArticleDetail = ({ currentUser }: Props) => {
  const params = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [favorited, setFavorited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ion-plus-round"></i>
                &nbsp; {article.author.username} <span className="counter">(10)</span>
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
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ion-plus-round"></i>
                &nbsp; Follow Eric Simons
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

          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              {currentUser && (
                <>
                  <form className="card comment-form">
                    <div className="card-block">
                      <textarea
                        className="form-control"
                        placeholder="Write a comment..."
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="card-footer">
                      {/* <img
                        src={currentUser.image}
                        alt="avatar"
                        width={100}
                        height={100}
                        className="comment-author-img"
                      /> */}

                      <Image
                        src={currentUser.image || defaultImage}
                        className="comment-author-img"
                        alt="avatar"
                        width={100}
                        height={100}
                      />

                      <button className="btn btn-sm btn-primary">
                        Post Comment
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* <div className="card">
                <div className="card-block">
                  <p className="card-text">
                    With supporting text below as a natural lead-in to
                    additional content.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/profile/author" className="comment-author">
                    <img
                      src="http://i.imgur.com/Qr71crq.jpg"
                      className="comment-author-img"
                    />
                  </Link>
                  &nbsp;
                  <Link href="/profile/jacob-schmidt" className="comment-author">
                    Jacob Schmidt
                  </Link>
                  <span className="date-posted">Dec 29th</span>
                </div>
              </div>

              <div className="card">
                <div className="card-block">
                  <p className="card-text">
                    With supporting text below as a natural lead-in to
                    additional content.
                  </p>
                </div>
                <div className="card-footer">
                  <Link href="/profile/author" className="comment-author">
                    <img
                      src="http://i.imgur.com/Qr71crq.jpg"
                      className="comment-author-img"
                    />
                  </Link>
                  &nbsp;
                  <Link href="/profile/jacob-schmidt" className="comment-author">
                    Jacob Schmidt
                  </Link>
                  <span className="date-posted">Dec 29th</span>
                  <span className="mod-options">
                    <i className="ion-trash-a"></i>
                  </span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;
