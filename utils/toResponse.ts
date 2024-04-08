import {
  ArticleFavorited,
  ArticleResponse,
  SafeUser,
  UserFollow,
  UserResponse,
} from "@/types/user";

export const toResponseUser = (
  user: UserFollow,
  currentUser: SafeUser | null
): UserResponse => {
  let following: boolean = false;
  const f = user.followedBy.map((item) => {
    return item.followerId;
  });
  if (currentUser) {
    if (f.includes(currentUser?.id)) {
      following = true;
    }
  }
  return {
    email: user?.email,
    username: user?.username,
    bio: user?.bio,
    image: user?.image,
    following: currentUser ? following : false,
  };
};

export const toResponseArticle = (
  article: ArticleFavorited,
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
    author: {
      username: article.author.username,
      bio: article.author.bio,
      image: article.author.image,
    },
    favoritesCount: article.favoritesCount,
  };
};
