import prisma from "@/libs/prismadb";
import { revalidatePath } from "next/cache";
import { ArticleFavorited } from "@/types/user";
import axios from "axios";

export async function revalidate(slug: string) {
  revalidatePath("/");
  revalidatePath(`/profile/[username]`, "page");
  revalidatePath(`/article/${slug}`);
}

export async function findArticleBySlug(slug: string) {
  const articleInclude = {
    include: {
      author: {
        include: {
          followedBy: true,
          following: true,
        },
      },
      favourites: true,
    },
  };
  return await prisma.article.findUnique({
    where: { slug },
    ...articleInclude,
  });
}

export function isArticleFavorited(article: ArticleFavorited, userId: string) {
  return article.favourites.some((item) => item.userId === userId);
}

export async function createFavourite(articleId: string, userId: string) {
  await prisma.favourites.create({
    data: {
      favoriting: { connect: { id: articleId } },
      favoritedBy: { connect: { id: userId } },
    },
  });
}

export async function updateFavoritesCount(articleId: string) {
  const favoritesCount = await prisma.favourites.count({
    where: { articleId },
  });

  await prisma.article.update({
    where: { id: articleId },
    data: { favoritesCount },
  });
}


// updateFavorite
export type Operation = "add" | "remove";

export const updateFavorite = async (
  articleSlug: string,
  setFavoritesCount: (count: number) => void,
  currentFavoritesCount: number,
  setFavorited: (favorited: boolean) => void,
  setIsLoading: (isLoading: boolean) => void,
  operation: Operation
) => {
  try {
    setIsLoading(true);

    const response = await performFavoriteOperation(articleSlug, operation);

    if (response?.status === 200) {
      const updatedFavoritesCount = calculateUpdatedCount(
        operation,
        currentFavoritesCount
      );
      setFavoritesCount(updatedFavoritesCount);
      setFavorited(response?.data.article.favorited);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
};

const performFavoriteOperation = async (
  articleSlug: string,
  operation: Operation
) => {
  return operation === "add"
    ? await axios.post(`/api/articles/${articleSlug}/favorite`)
    : await axios.delete(`/api/articles/${articleSlug}/favorite`);
};

const calculateUpdatedCount = (
  operation: Operation,
  currentCount: number
): number => {
  return operation === "add" ? currentCount + 1 : currentCount - 1;
};
