import { getCurrentUser } from "@/actions/getCurrentUser";
import { ApiResponse } from "@/app/api/response";
import prisma from "@/libs/prismadb";
import { NextRequest } from "next/server";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    await prisma.comments.delete({
      where: { id: params.id },
    });

    return ApiResponse.noContent();
  } catch (error) {
    return ApiResponse.badRequest("Error deleted comment");
  }
};
