import { toResponseUser } from "@/utils/toResponse";
import { ApiResponse } from "@/app/api/response";
import prisma from "@/libs/prismadb";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export const GET = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    const user = await prisma.user.findFirst({
      where: { username: params.username },
      include: { followedBy: true, following: true },
    });

    if (!user) {
      return ApiResponse.notFound("User not found");
    }

    return ApiResponse.ok({ user: toResponseUser(user, currentUser) });
  } catch (error) {
    return ApiResponse.badRequest("Error fetching user");
  }
};
