import ArticlePreview from "./ArticlePreview";
import React, { Fragment } from "react";
import { SafeUser, type ArticleResponse } from "@/types/user";

type Props = {
  articles?: ArticleResponse[];
  currentUser: SafeUser | null
};

const ArticlesContainer = ({ articles = [], currentUser }: Props) => {
  return (
    <>
      {articles.length > 0 &&
        articles?.map((article: ArticleResponse) => (
          <Fragment key={article.slug}>
            <ArticlePreview article={article} currentUser={currentUser} />
          </Fragment>
        ))}
    </>
  );
};

export default ArticlesContainer;
