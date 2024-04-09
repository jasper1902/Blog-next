"use client";
import { ArticleResponse } from "@/types/user";
import { updateFavorite } from "@/utils/articlesUtils";
import React, { useState } from "react";

type Props = {
  article: ArticleResponse;
};

const FavoriteButton = ({ article }: Props) => {
  const [favorited, setFavorited] = useState<boolean>(article.favorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [favoritesCount, setFavoritesCount] = useState<number>(
    article.favoritesCount
  );
  return (
    <>
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
    </>
  );
};

export default FavoriteButton;
