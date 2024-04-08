import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { ApiResponse } from "@/app/api/response";
import { userRegisterSchema } from "@/validation/schema";
import { type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { username, email, password } = body.user;

    const result = userRegisterSchema.safeParse(body.user);
    if (!result.success) {
      return ApiResponse.badRequest(result.error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    return ApiResponse.ok({ user });
  } catch (error) {
    return ApiResponse.badRequest("Register failed");
  }
};
