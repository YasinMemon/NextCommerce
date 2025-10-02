import { z } from "zod";

export const zodSchema = z.object({
  fullName: z
      .string()
      .trim()
      .min(3, { message: "Full name must be at least 3 characters long" })
      .max(50, { message: "Full name must be less than 50 characters" })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Full name can only contain letters and spaces",
  }),

  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password is too long" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
      {
        message:
          "Password must include uppercase, lowercase, number and special character",
      }
    ),

  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});