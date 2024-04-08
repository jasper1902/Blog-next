import { z } from "zod";

export const userRegisterSchema = z.object({
  username: z.string().max(20, "Username is too long"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password is too short"),
});
