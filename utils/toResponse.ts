import {
  ArticleFavorited,
  ArticleResponse,
  CommentResponse,
  SafeUser,
  UserFollow,
  UserResponse,
} from "@/types/user";

import { type Comments } from ".prisma/client";

export const toResponseUser = (
  userToConvert: UserFollow,
  requestingUser: SafeUser | null
): UserResponse => {
  let isFollowing: boolean = false;
  const followersIds = userToConvert.followedBy.map((follower) => {
    return follower.followerId;
  });
  if (requestingUser) {
    if (followersIds.includes(requestingUser?.id)) {
      isFollowing = true;
    }
  }
  return {
    username: userToConvert?.username,
    bio: userToConvert?.bio,
    image: userToConvert?.image,
    following: requestingUser ? isFollowing : false,
  };
};

export const toResponseArticle = (
  article: ArticleFavorited & { author: UserFollow },
  currentUser: SafeUser | null
): ArticleResponse => {
  let favorited: boolean = false;

  if (currentUser) {
    favorited = article.favourites.some(
      (item) => item.userId === currentUser.id
    );
  }

  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tags,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited: favorited,
    author: toResponseUser(article.author, currentUser),
    favoritesCount: article.favoritesCount,
  };
};

export const toResponseComment = (
  comment: Comments & { author: UserFollow },
  currentUser: SafeUser | null
): CommentResponse => {
  return {
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: toResponseUser(comment.author, currentUser),
  };
};
