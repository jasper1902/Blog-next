import { NextRequest } from "next/server";
import { ApiResponse } from "../../response";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { findArticleBySlug } from "@/utils/articlesUtils";
import { toResponseArticle } from "@/utils/toResponse";

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const currentUser = await getCurrentUser();

    const article = await findArticleBySlug(params.slug);
    if (!article) {
      return ApiResponse.notFound("Article not exists");
    }

    return ApiResponse.ok({
      article: toResponseArticle(article, currentUser),
    });
  } catch (error) {
    return ApiResponse.badRequest(error);
  }
};
