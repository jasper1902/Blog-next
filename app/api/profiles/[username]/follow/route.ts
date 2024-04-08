import { ApiResponse } from "@/app/api/response";
import prisma from "@/libs/prismadb";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { toResponseUser } from "@/utils/toResponse";

const getUserByUsernameWithRelations = async (username: string) => {
  return await prisma.user.findFirst({
    where: { username },
    include: { followedBy: true, following: true },
  });
};

export const POST = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    const userToFollow = await getUserByUsernameWithRelations(params.username);
    if (!userToFollow) {
      return ApiResponse.notFound("User not found");
    }

    const isAlreadyFollowing = userToFollow.followedBy.some(
      (follower) => follower.followerId === currentUser.id
    );
    if (isAlreadyFollowing) {
      return ApiResponse.badRequest("Already following this user");
    }

    await prisma.follows.create({
      data: { followingId: userToFollow.id, followerId: currentUser.id },
    });

    return ApiResponse.ok(toResponseUser(userToFollow, currentUser));
  } catch (error) {
    return ApiResponse.badRequest("Failed to follow user");
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ApiResponse.unauthorized();
    }

    const userToUnfollow = await getUserByUsernameWithRelations(params.username);
    if (!userToUnfollow) {
      return ApiResponse.notFound("User not found");
    }

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: userToUnfollow.id,
        },
      },
    });

    return ApiResponse.ok(toResponseUser(userToUnfollow, currentUser));
  } catch (error) {
    return ApiResponse.badRequest("Failed to unfollow user");
  }
};
