"use client";
import { formatDate } from "@/utils/formatDate";
import React, { Fragment, useState } from "react";
import { ArticleResponse, type ArticleFavorited } from "@/types/user";
import { defaultImage } from "@/utils/mapper";
import Image from "next/image";
import { updateFavorite } from "@/utils/articlesUtils";
import Link from "next/link";

type Props = {
  article: ArticleResponse;
};

const ArticlePreview = ({ article }: Props) => {
  const [favoritesCount, setFavoritesCount] = useState<number>(
    article.favoritesCount
  );
  const [favorited, setFavorited] = useState<boolean>(article.favorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <div className="article-preview" key={article.slug}>
        <div className="article-meta">
          <a href={`/profile/${article.author.username}`}>
            <Image
              src={article.author.image || defaultImage}
              alt="avatar"
              width={100}
              height={100}
            />
          </a>
          <div className="info">
            <Link
              href={`/profile/${article.author.username}`}
              className="author"
            >
              {article.author.username}
            </Link>
            <span className="date">{formatDate(article.createdAt)}</span>
          </div>
          <button
            className={`btn ${
              favorited ? "btn-primary" : "btn-outline-primary"
            } btn-sm pull-xs-right`}
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
            <i className="ion-heart"></i> {favoritesCount}
          </button>
        </div>
        <a href={`/article/${article.slug}`} className="preview-link">
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <span>Read more...</span>
          <ul className="tag-list">
            {article.tagList.map((tag) => (
              <Fragment key={tag}>
                <li className="tag-default tag-pill tag-outline">{tag}</li>
              </Fragment>
            ))}
          </ul>
        </a>
      </div>
    </>
  );
};

export default ArticlePreview;
