import { getCurrentUser } from "@/actions/getCurrentUser";
import { ApiResponse } from "@/app/api/response";
import prisma from "@/libs/prismadb";
import { findArticleBySlug } from "@/utils/articlesUtils";
import { toResponseComment } from "@/utils/toResponse";
import { NextRequest } from "next/server";
export const POST = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    const body = await request.json();
    if (body.comment.body === "") {
      return ApiResponse.badRequest("body is required");
    }

    const article = await findArticleBySlug(params.slug);
    if (!article) {
      return ApiResponse.notFound("Article not exists");
    }

    const comment = await prisma.comments.create({
      data: {
        body: body.comment.body,
        authorId: currentUser.id,
        articleId: article.id,
      },
      include: {
        author: {
          include: {
            followedBy: true,
            following: true,
          },
        },
      },
    });
    return ApiResponse.ok({
      comments: toResponseComment(comment, currentUser),
    });
  } catch (error) {
    return ApiResponse.badRequest("Error creating comment");
  }
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    const comments = await prisma.article.findUnique({
      where: { slug: params.slug },
      include: {
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              include: {
                followedBy: true,
                following: true,
              },
            },
          },
        },
      },
    });

    return ApiResponse.ok({
      comments: comments?.comments.map((comment) => {
        return toResponseComment(comment, currentUser);
      }),
    });
  } catch (error) {
    return ApiResponse.badRequest(error);
  }
};

