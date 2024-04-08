import { getCurrentUser } from "@/actions/getCurrentUser";
import { ApiResponse } from "@/app/api/response";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import { toResponseUser } from "@/utils/toResponse";
import { type NextRequest } from "next/server";

export const PUT = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    const body = await request.json();
    let hashedPassword;
    if (body.user.password) {
      hashedPassword = await bcrypt.hash(body.user.password, 10);
    }

    const userDataToUpdate: any = {
      email: body.user.email,
      username: body.user.username,
      bio: body.user.bio,
      image: body.user.image,
    };

    if (hashedPassword) {
      userDataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: userDataToUpdate,
      include: { followedBy: true, following: true },
    });

    return ApiResponse.ok(toResponseUser(updatedUser, currentUser));
  } catch (error) {
    return ApiResponse.badRequest("");
  }
};
