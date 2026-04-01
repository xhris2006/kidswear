"use client";
// app/auth/login/page.tsx
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { isAdminRole } from "@/lib/roles";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    const session = await getSession();
    const role = (session?.user as any)?.role;
    const destination =
      redirect !== "/" ? redirect : isAdminRole(role) ? "/admin/dashboard" : "/";

    toast.success("Welcome back!");
    router.push(destination);
    router.refresh();
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              <span className="text-white font-playfair font-bold text-2xl">K</span>
            </div>
            <span className="font-playfair font-bold text-3xl text-gray-900">
              Kids<span style={{ color: "#FF6B6B" }}>Wear</span>
            </span>
          </Link>
          <h1 className="font-playfair text-2xl font-bold text-gray-900">
            Welcome Back!
          </h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  className="input-field pr-12"
                  placeholder="........"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative text-center">
              <span className="px-4 bg-white text-gray-400 text-sm">
                or continue with
              </span>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
            <button
              onClick={() => signIn("google", { callbackUrl: redirect })}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-2xl py-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          )}

          <p className="text-center mt-6 text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-bold hover:underline"
              style={{ color: "#FF6B6B" }}
            >
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
