"use client";

import React, { useState, Suspense } from "react";
import { Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { Eye, EyeOff, AtSign, Lock, RefreshCw } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { type User } from "@/app/lib/auth";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import AuthAnimation from "@/components/AuthAnimation"; 
import { useMutation } from "@tanstack/react-query";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

   // 1. Standard Email/Password Login Mutation
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const { error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: callbackUrl,
            });

            if (error) {
                throw new Error(error.message || "Login failed.");
            }

            return await authClient.getSession();
        },
        // Fix: Explicitly type sessionResult using the return type of getSession()
        onSuccess: (sessionResult: Awaited<ReturnType<typeof authClient.getSession>>) => {
            toast.success("Welcome back!");
            const userRole = (sessionResult?.data?.user as User)?.role;

            let targetDestination = callbackUrl;
            if (callbackUrl === "/dashboard" || callbackUrl === "/") {
                if (userRole === "admin") targetDestination = "/dashboard/admin";
                else if (userRole === "user") targetDestination = "/dashboard/user";
            }
            window.location.href = targetDestination;
        },
        onError: (error: Error) => {
            toast.error(error.message || "An unexpected error occurred.");
        },
    });

    // 2. Demo User Login Mutation
    const demoLoginMutation = useMutation({
        mutationFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const { error } = await authClient.signIn.email({
                email: "demo@scholarai.com",
                password: "Password123!",
                callbackURL: "/",
            });

            if (error) {
                throw new Error("Demo login failed: " + error.message);
            }
        },
        onSuccess: () => {
            window.location.href = "/";
        },
        onError: (error: Error) => {
            toast.error(error.message || "An unexpected error occurred.");
        },
    });

    // 3. Google Social Login Mutation
    const googleLoginMutation = useMutation({
        mutationFn: async () => {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}${callbackUrl}`,
            });
        },
        onError: () => {
            toast.error("Google login failed.");
        },
    });

    // Combine pending states (Note: use .isLoading instead of .isPending if you are using TanStack Query v4)
    const isLoading = loginMutation.isPending || demoLoginMutation.isPending || googleLoginMutation.isPending;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    const handleDemoLogin = () => {
        setEmail("demo@scholarai.com");
        setPassword("Password123!");
        demoLoginMutation.mutate();
    };

    const handleGoogleLogin = () => {
        googleLoginMutation.mutate();
    };

    return (
        <div className="w-full max-w-5xl flex rounded-[32px] overflow-hidden shadow-2xl bg-white border border-slate-200 min-h-[600px]">
            {/* Left Side: Framer Motion Animation */}
            <AuthAnimation />

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-center">
                <div className="pb-8">
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-slate-500 mt-2">Continue your journey toward academic excellence.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <TextField isRequired name="email" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-zinc-600">Email Address</Label>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 bg-zinc-50 focus-within:border-amber-500 transition-colors">
                            <AtSign className="text-zinc-400" size={16} />
                            <Input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400" 
                                placeholder="name@university.edu" 
                            />
                        </InputGroup>
                    </TextField>

                    <TextField isRequired name="password" className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium text-zinc-600">Password</Label>
                            <Link href="/auth/ForgotPassword" className="text-[11px] text-amber-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 bg-zinc-50 focus-within:border-amber-500 transition-colors">
                            <Lock className="text-zinc-400" size={16} />
                            <Input 
                                type={isVisible ? "text" : "password"} 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400" 
                                placeholder="••••••••" 
                            />
                            <button type="button" onClick={toggleVisibility} className="text-zinc-400 focus:outline-none">
                                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </InputGroup>
                    </TextField>

                    <Button 
                        type="submit" 
                        isDisabled={isLoading} 
                        className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-orange-950/10 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <RefreshCw className="animate-spin" size={16} /> : "Log In"}
                    </Button>
                    
                    <Button 
                        type="button" 
                        onClick={handleDemoLogin} 
                        isDisabled={isLoading} 
                        className="w-full h-11 rounded-xl font-semibold text-sm text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-50 transition-all"
                    >
                        Login as Demo User
                    </Button>
                </form>

                <div className="mt-6 flex flex-col gap-3">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-200"></div>
                        </div>
                        <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-zinc-400">or continue with</span>
                    </div>

                    <Button 
                        onClick={handleGoogleLogin} 
                        isDisabled={isLoading}
                        className="w-full h-11 rounded-xl font-semibold text-sm bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 flex items-center justify-center transition-all"
                    >
                        <FcGoogle size={18} className="mr-2" /> Google
                    </Button>

                    <p className="text-center text-xs text-zinc-500 mt-2">
                        New here? <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-amber-600 hover:underline font-bold ml-1">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginComponent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
            <Suspense 
                fallback={
                    <div className="flex items-center justify-center">
                        <RefreshCw className="animate-spin text-amber-500" size={32} />
                    </div>
                }
            >
                <LoginForm />
            </Suspense>
        </div>
    );
}