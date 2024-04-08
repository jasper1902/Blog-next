import { User } from ".prisma/client";

export const defaultImage = process.env.NEXT_PUBLIC_DEFAULT_IMAGE || "";

export function userMapper(user: User, following: boolean = false) {
  const { id, username, email, bio, image } = user;
  return {
    id,
    username,
    email,
    bio,
    image: image || defaultImage,
    following,
  };
}
