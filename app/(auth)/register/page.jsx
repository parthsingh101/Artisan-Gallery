"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Registration failed");
      } else {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-ink mb-2">Create Account</h1>
        <p className="text-charcoal-500 font-body">Join our exclusive art community</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-charcoal-700 font-body">Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="Leonardo da Vinci"
              disabled={loading}
              autoComplete="name"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-charcoal-700 font-body">Email Address</label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                  message: "Invalid email" 
                }
              })}
              type="email"
              className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="artist@example.com"
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-charcoal-700 font-body">Password</label>
            <input
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              type="password"
              className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="new-password"
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
                <span>Creating Account...</span>
              </div>
            ) : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-cream-200 text-center">
          <p className="text-sm text-charcoal-500 font-body">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-600 hover:text-gold-700 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
