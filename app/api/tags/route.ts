import prisma from "@/libs/prismadb";
import { ApiResponse } from "@/app/api/response";
import { type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const articles = await prisma.article.findMany({
      take: 30,
      select: {
        tags: true,
      },
    });

    // Count occurrences of each tag
    const tagCounts: { [key: string]: number } = {};
    articles.forEach((article) => {
      article.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Sort tags based on their counts
    const sortedTags = Object.keys(tagCounts).sort(
      (a, b) => tagCounts[b] - tagCounts[a]
    );
    return ApiResponse.ok({ tags: sortedTags });
  } catch (error) {
    return ApiResponse.badRequest("Error fetching tags");
  }
};
