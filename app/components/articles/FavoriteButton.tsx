"use client";
import { ArticleResponse, SafeUser } from "@/types/user";
import { updateFavorite } from "@/utils/articlesUtils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  article: ArticleResponse;
  currentUser: SafeUser | null;
  className?: string;
  title?: string;
};

const FavoriteButton = ({ article, currentUser, className, title }: Props) => {
  const [favorited, setFavorited] = useState<boolean>(article.favorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const [favoritesCount, setFavoritesCount] = useState<number>(
    article.favoritesCount
  );
  return (
    <>
      <button
        className={`btn ${
          favorited ? "btn-primary" : "btn-outline-primary"
        } btn-sm ${className}`}
        disabled={isLoading}
        onClick={() => {
          if (currentUser) {
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
                );
          } else {
            router.push("/login");
          }
        }}
      >
        {title}
        <i className="ion-heart"></i>{" "}
        {title ? `(${favoritesCount})` : favoritesCount}
      </button>
    </>
  );
};

export default FavoriteButton;
