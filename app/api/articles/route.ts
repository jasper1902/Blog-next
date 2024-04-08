import prisma from "@/libs/prismadb";
import { ApiResponse } from "@/app/api/response";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { type NextRequest } from "next/server";
import { toResponseArticle } from "@/utils/toResponse";
import slugify from "slugify";
export const POST = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    const body = await request.json();

    const article = await prisma.article.create({
      data: {
        title: body.articles.title,
        description: body.articles.description,
        body: body.articles.body,
        slug: slugify(body.articles.title),
        authorId: currentUser.id,
        tags: body.articles.tagList,
      },
      include: {
        author: true,
        favourites: true,
      },
    });

    return ApiResponse.ok({ article: toResponseArticle(article, currentUser) });
  } catch (error) {
    console.error("Error:", error);
    return ApiResponse.badRequest("Create article failed");
  }
};

export const GET = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();

    let tag: string | null;
    let author: string | null;
    let favorited: string | null;
    let offset: string | null;
    let limit: number;
    let page: number;

    const searchParams = request.nextUrl.searchParams;
    tag = searchParams.get("tag");
    author = searchParams.get("author");
    favorited = searchParams.get("favorited");
    offset = searchParams.get("offset");
    limit = parseInt(searchParams.get("limit") ?? "20");
    page = parseInt(searchParams.get("page") ?? "1");

    const whereClause: any = {};

    if (tag) {
      whereClause.tags = {
        has: tag,
      };
    }

    if (author) {
      whereClause.author = {
        username: {
          equals: author,
          mode: "insensitive",
        },
      };
    }

    if (favorited) {
      whereClause.favourites = {
        some: {
          favoritedBy: {
            username: favorited,
          },
        },
      };
    }

    const articles = await prisma.article.findMany({
      take: limit,
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        favourites: true,
      },
      skip: limit * (page - 1),
    });
    const totalCount = await prisma.article.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / limit);

    return ApiResponse.ok({
      article: articles.map((article) => {
        return toResponseArticle(article, currentUser);
      }),
      totalCount: totalCount,
      offset: offset,
      limit: limit,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error);
    return ApiResponse.badRequest("An error occurred while fetching articles.");
  }
};
