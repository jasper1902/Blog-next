import { ApiResponse } from "@/app/api/response";
import { NextRequest } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { toResponseArticle } from "@/utils/toResponse";
import { createFavourite, findArticleBySlug, isArticleFavorited, revalidate, updateFavoritesCount } from "@/utils/articlesUtils";

export const POST = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    const article = await findArticleBySlug(params.slug);
    if (!article) {
      return ApiResponse.notFound("Article not exists");
    }

    if (isArticleFavorited(article, currentUser.id)) {
      throw new Error("Article is already favorited");
    }

    try {
      await createFavourite(article.id, currentUser.id);
      revalidate(params.slug);
    } catch (error) {
      console.error(error);
    }

    updateFavoritesCount(article.id);

    const newArticle = await findArticleBySlug(params.slug);
    if (!newArticle) {
      return ApiResponse.notFound("Article not found");
    }

    return ApiResponse.ok({
      article: toResponseArticle(newArticle, currentUser),
    });
  } catch (error) {
    return ApiResponse.badRequest(error);
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    const article = await findArticleBySlug(params.slug);
    if (!article) {
      return ApiResponse.notFound("Article not exists");
    }

    await prisma.favourites.delete({
      where: {
        articleId_userId: {
          userId: currentUser.id,
          articleId: article.id,
        },
      },
    });

    updateFavoritesCount(article.id);

    const newArticle = await findArticleBySlug(params.slug);
    if (!newArticle) {
      return ApiResponse.notFound("Article not found");
    }

    return ApiResponse.ok({
      article: toResponseArticle(newArticle, currentUser),
    });
  } catch (error) {
    return ApiResponse.badRequest(error);
  }
};
