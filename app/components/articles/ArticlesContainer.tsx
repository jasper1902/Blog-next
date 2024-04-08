import ArticlePreview from "./ArticlePreview";
import React, { Fragment } from "react";
import { type ArticleResponse } from "@/types/user";

type Props = {
  articles?: ArticleResponse[];
};

const ArticlesContainer = ({ articles = [] }: Props) => {
  return (
    <>
      {articles.length > 0 &&
        articles?.map((article: ArticleResponse) => (
          <Fragment key={article.slug}>
            <ArticlePreview article={article} />
          </Fragment>
        ))}
    </>
  );
};

export default ArticlesContainer;
