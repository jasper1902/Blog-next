import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { toResponseArticle } from "@/utils/toResponse";
export const getGlobalFeed = async (limit: number, page: number) => {
  const currentUser = await getCurrentUser();
  try {
    const articles = await prisma.article.findMany({
      take: limit,
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
        favourites: true,
      },
      skip: limit * (page - 1),
    });

    const totalCount = await prisma.article.count();
    const totalPages = Math.ceil(totalCount / limit);

    return {
      article: articles.map((article) => {
        return toResponseArticle(article, currentUser);
      }),
      totalCount: totalCount,
      limit: limit,
      totalPages: totalPages,
    };
  } catch (error) {
    console.log(error);
  }
};
