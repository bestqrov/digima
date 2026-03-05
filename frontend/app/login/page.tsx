'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TruckIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';

// ─── Validation ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

// ─── Demo credential presets ─────────────────────────────────────────────────

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@arwapark.com', password: 'admin123' },
  { label: 'Agency', email: 'agency@example.com', password: 'agency123' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      router.push(callbackUrl);
    } catch {
      // handled inside auth store via toast
    }
  };

  const fillDemo = useCallback(
    (account: (typeof DEMO_ACCOUNTS)[number]) => {
      setValue('email', account.email);
      setValue('password', account.password);
      toast.success(`${account.label} credentials filled`, { duration: 1500 });
    },
    [setValue],
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Status banner */}
        <div className="mb-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <p className="text-xs font-medium text-white/70">
            System Online <span className="text-emerald-400">· API v1.0.0 Ready</span>
          </p>
        </div>

        {/* Main panel */}
        <div className="rounded-2xl bg-white/[0.07] border border-white/10 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-lg opacity-50" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-white/50">Sign in to your ArwaPark dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-white/70 mb-1.5">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm placeholder-white/25 outline-none transition focus:ring-2 focus:ring-indigo-500/50 ${
                  errors.email ? 'border-red-500/60' : 'border-white/10 focus:border-indigo-500/60'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-white/5 border text-white text-sm placeholder-white/25 outline-none transition focus:ring-2 focus:ring-indigo-500/50 ${
                    errors.password ? 'border-red-500/60' : 'border-white/10 focus:border-indigo-500/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-indigo-500"
                />
                Remember me
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-7 rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <InformationCircleIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-white/70">Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acct) => (
                <button
                  key={acct.label}
                  type="button"
                  onClick={() => fillDemo(acct)}
                  className="flex flex-col items-center py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 transition-all text-center"
                >
                  <span className="text-xs font-semibold text-white">{acct.label}</span>
                  <span className="text-[10px] text-white/40 mt-0.5 truncate w-full">{acct.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center space-y-1">
          <p className="text-xs text-white/30">Connected to arwapark.digima.cloud</p>
          <a
            href="https://arwapark.digima.cloud/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
          >
            View API Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
