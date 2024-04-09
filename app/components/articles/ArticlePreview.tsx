import { formatDate } from "@/utils/formatDate";
import React, { Fragment } from "react";
import { ArticleResponse, SafeUser } from "@/types/user";
import { defaultImage } from "@/utils/mapper";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

type Props = {
  article: ArticleResponse;
  currentUser: SafeUser | null
};

const ArticlePreview = ({ article, currentUser }: Props) => {
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
          <FavoriteButton article={article} currentUser={currentUser} className="pull-xs-right"/>
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
