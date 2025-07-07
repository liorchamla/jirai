import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(100, { message: "Username must be at most 100 characters long" }),
  email: z.string({ message: "Email is required" }).email(),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export const userLoginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z.string({ message: "Password is required" }),
});

export const userUpdateSchema = createUserSchema.partial();

export const createUserOnCommandSchema = createUserSchema.extend({
  position: z.string({ message: "Position is required" }),
});
