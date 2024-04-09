import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { ApiResponse } from "@/app/api/response";
import { userRegisterSchema } from "@/validation/schema";
import { type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { username, email, password } = body.user;

    const validationResult = userRegisterSchema.safeParse(body.user);
    if (!validationResult.success) {
      return ApiResponse.badRequest(validationResult.error);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: email,
              mode: "insensitive",
            },
          },
          {
            username: {
              equals: username,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return ApiResponse.badRequest("That email is already taken");
      } else {
        return ApiResponse.badRequest("That username is already taken");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    return ApiResponse.ok({ user: newUser });
  } catch (error) {
    return ApiResponse.badRequest("Register failed");
  }
};
