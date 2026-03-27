"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (res.error) {
        toast.error(res.error || "Invalid credentials");
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-ink mb-2">Welcome Back</h1>
        <p className="text-charcoal-500 font-body">Sign in to your Artisan account</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-charcoal-700 font-body">Email Address</label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                  message: "Invalid email address" 
                }
              })}
              type="email"
              className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="name@example.com"
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-charcoal-700 font-body">Password</label>
            </div>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-3.5 mt-2 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
            disabled={loading}
          >
            {loading ? (
               <div className="flex items-center gap-2">
                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 <span>Signing in...</span>
               </div>
            ) : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-cream-200 text-center">
          <p className="text-sm text-charcoal-500 font-body">
            New to our Gallery?{" "}
            <Link href="/register" className="text-gold-600 hover:text-gold-700 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
