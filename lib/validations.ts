// lib/validations.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1, "Category is required"),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  tags: z.array(z.string()),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      size: z.string().optional(),
      color: z.string().optional(),
    })
  ),
  shippingName: z.string().min(2),
  shippingEmail: z.string().email(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingState: z.string().optional(),
  shippingZip: z.string().min(3),
  shippingCountry: z.string().min(2),
});

export const checkoutSchema = z.object({
  shippingName: z.string().min(2, "Full name required"),
  shippingEmail: z.string().email("Valid email required"),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().min(5, "Address required"),
  shippingCity: z.string().min(2, "City required"),
  shippingState: z.string().optional(),
  shippingZip: z.string().min(3, "ZIP code required"),
  shippingCountry: z.string().min(2, "Country required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
