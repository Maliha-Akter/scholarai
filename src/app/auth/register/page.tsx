"use client";

import { useState, Suspense } from "react";
import { Card, Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { Eye, EyeOff, AtSign, Lock, User, Image as ImageIcon, RefreshCw } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import AuthAnimation from "@/components/AuthAnimation";
import { useMutation } from "@tanstack/react-query";

// 1. Separate the main logic into a sub-component
function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Captures where the user originally came from, defaults to home page
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // --- Form States ---
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");        // stores the absolute image URL path
    const [fileName, setFileName] = useState("");   // stores the uploaded file name for display

    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    // Form validation
    const validateForm = () => {
        let newErrors: Record<string, string> = {};

        if (name.length < 2) newErrors.name = "Name must be at least 2 characters.";
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            newErrors.password = "Must be 6+ chars, 1 number, 1 upper & lower case.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- TanStack Mutations ---

    // Signup Mutation
    const signupMutation = useMutation({
        mutationFn: async (payload: Parameters<typeof authClient.signUp.email>[0]) => {
            const { data, error } = await authClient.signUp.email(payload);
            if (error) {
                throw new Error(error.message || "Signup failed.");
            }
            return data;
        },
        onSuccess: async () => {
            toast.success("Account created successfully!");
            await authClient.signOut();
            
            const redirectTo = `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
            router.push(redirectTo);

            // Reset form
            setName("");
            setEmail("");
            setPassword("");
            setImage("");
            setFileName("");
            setErrors({});
        },
        onError: (error: any) => {
            toast.error(error.message || "An unexpected network error occurred.");
        },
    });

    // File Upload Mutation
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Upload failed");
            }
            return data.data.url; // Assuming backend returns url here
        },
        onSuccess: (url) => {
            setImage(url);
            setFileName("");
            toast.success("File uploaded successfully!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to upload the image.");
            setFileName("");
        },
    });

    // --- Handlers ---
    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        signupMutation.mutate({
            email,
            password,
            name,
            image: image || "",
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        uploadMutation.mutate(file);
    };

    const handleGoogleSignup = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: window.location.origin + callbackUrl,
            });
        } catch (err) {
            toast.error("Failed to authenticate with Google.");
        }
    };

    // General disabled flag if either operation is executing
    const isAnyPending = signupMutation.isPending || uploadMutation.isPending;

    return (
        <div className="w-full max-w-5xl flex rounded-[32px] overflow-hidden shadow-2xl bg-white border border-slate-200 min-h-[600px]">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-center">
                <div className="pb-8">
                    <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Create Account</h1>
                    <p className="text-sm text-slate-500 mt-2">Start your academic success today.</p>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    {/* Name Field */}
                    <TextField isRequired name="name" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-zinc-600">Name</Label>
                        <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-zinc-50 focus-within:border-amber-500 transition-colors ${errors.name ? "border-red-500" : "border-zinc-200"}`}>
                            <User className="text-zinc-400" size={16} />
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                                disabled={isAnyPending}
                            />
                        </InputGroup>
                        {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
                    </TextField>

                    {/* Email Field */}
                    <TextField isRequired name="email" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-zinc-600">Email Address</Label>
                        <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-zinc-50 focus-within:border-amber-500 transition-colors ${errors.email ? "border-red-500" : "border-zinc-200"}`}>
                            <AtSign className="text-zinc-400" size={16} />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                                disabled={isAnyPending}
                            />
                        </InputGroup>
                        {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                    </TextField>

                    {/* Avatar Input */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium text-zinc-600">Avatar</Label>
                            <span className="text-[9px] text-zinc-400">{fileName || "Paste URL or upload a file"}</span>
                        </div>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 bg-zinc-50 focus-within:border-[#7C3AED] transition-colors">
                            <ImageIcon className="text-zinc-400" size={16} />
                            <Input
                                placeholder="https://example.com/avatar.png"
                                type="url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                                disabled={isAnyPending}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                                disabled={isAnyPending}
                            />
                            <label
                                htmlFor="file-upload"
                                className={`text-xs font-bold whitespace-nowrap transition-colors ${
                                    isAnyPending 
                                    ? "text-zinc-400 cursor-not-allowed" 
                                    : "text-[#7C3AED] cursor-pointer hover:text-[#5B21B6]"
                                }`}
                            >
                                {uploadMutation.isPending ? "Uploading..." : "Upload File"}
                            </label>
                        </InputGroup>
                    </div>

                    {/* Password Field */}
                    <TextField isRequired name="password" className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium text-zinc-600">Password</Label>
                        </div>
                        <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-zinc-50 focus-within:border-amber-500 transition-colors ${errors.password ? "border-red-500" : "border-zinc-200"}`}>
                            <Lock className="text-zinc-400" size={16} />
                            <Input
                                type={isVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                                disabled={isAnyPending}
                            />
                            <button type="button" onClick={toggleVisibility} className="text-zinc-400 focus:outline-none" disabled={isAnyPending}>
                                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </InputGroup>
                        {errors.password && <p className="text-[10px] text-red-500 mt-0.5">{errors.password}</p>}
                    </TextField>

                    <Button
                        type="submit"
                        className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-orange-950/10 hover:opacity-95 active:scale-[0.99] transition-all"
                        isDisabled={isAnyPending}
                    >
                        {signupMutation.isPending ? "Registering..." : "Register"}
                    </Button>
                    
                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-zinc-200"></div>
                        <span className="flex-shrink-0 mx-4 text-xs font-medium text-zinc-400">OR</span>
                        <div className="flex-grow border-t border-zinc-200"></div>
                    </div>

                    {/* Google Sign-in Button */}
                    <Button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full h-11 rounded-xl font-medium text-sm text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                        isDisabled={isAnyPending}
                    >
                        <FcGoogle size={20} />
                        Sign up with Google
                    </Button>

                    {/* Login Link for existing users */}
                    <p className="text-center text-xs text-zinc-500 mt-2">
                        Already have an account?{" "}
                        <Link 
                            href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} 
                            className="text-amber-600 font-semibold hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right Side: Animation */}
            <AuthAnimation />
        </div>
    );
}

// 2. Wrap the component in a Suspense boundary in the default export
export default function RegisterComponent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
            <Suspense 
                fallback={
                    <div className="flex items-center justify-center">
                        <RefreshCw className="animate-spin text-amber-500" size={32} />
                    </div>
                }
            >
                <RegisterForm />
            </Suspense>
        </div>
    );
}