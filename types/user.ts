import { $Enums, Article, Favourites, Follows, User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type ArticleWithAuthor = Article & { author: User };

export type ArticleFavorited = {
  favourites: Favourites[];
  author: User;
} & Article;

export type ArticleResponse = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
} & { author: { username: string; bio: string | null; image: string | null } };

export type UserResponse = {
  username: string;
  email?: string;
  bio: string | null;
  image: string | null;
  following: boolean;
};

export type UserFollow = User & {
  followedBy: Follows[];
  following: Follows[];
};
