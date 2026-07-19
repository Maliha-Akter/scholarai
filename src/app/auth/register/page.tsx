"use client";

import { useState } from "react";
import { Card, Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { Eye, EyeOff, AtSign, Lock, User, Image as ImageIcon } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import AuthAnimation from "@/components/AuthAnimation";

export default function RegisterComponent() {
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
    const [isLoading, setIsLoading] = useState(false);
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


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        const registrationPayload = {
            email,
            password,
            name,
            image: image || "",
        };

        try {
            // ✅ FIXED: Using unified authClient instance methods directly
            const { error: authError } = await authClient.signUp.email(registrationPayload);

            if (authError) {
                toast.error(authError.message || "Signup failed.");
            } else {
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
            }
        } catch (err) {
            toast.error("An unexpected network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await response.json();

            if (data.success) {
                setImage(data.data.url);
                setFileName(""); // 👈 FIX: Clear the filename so the URL takes over!
                toast.success("File uploaded successfully!");
            } else {
                toast.error("Upload failed");
                setFileName("");
            }
        } catch (err) {
            toast.error("Failed to upload the image.");
            setFileName("");
        } finally {
            setIsLoading(false);
        }
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
            <div className="w-full max-w-5xl flex rounded-[32px] overflow-hidden shadow-2xl bg-white border border-slate-200 min-h-[600px]">

                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-white">
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
                                />
                            </InputGroup>
                            {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                        </TextField>

                        {/* Avatar Input (Already has a light background, adjusted text for consistency) */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-medium text-zinc-600">Avatar</Label>
                                <span className="text-[9px] text-zinc-400">Paste URL or upload a file</span>
                            </div>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 bg-zinc-50 focus-within:border-[#7C3AED] transition-colors">
                                <ImageIcon className="text-zinc-400" size={16} />
                                <Input
                                    placeholder="https://example.com/avatar.png"
                                    type="url"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer text-[#7C3AED] text-xs font-bold whitespace-nowrap hover:text-[#5B21B6] transition-colors"
                                >
                                    {isLoading ? "Uploading..." : "Upload File"}
                                </label>
                            </InputGroup>
                        </div>

                        {/* Password Field */}
                        <TextField isRequired name="password" className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-medium text-zinc-600">Password</Label>
                                <Link href="/auth/ForgotPassword" className="text-[11px] text-amber-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-zinc-50 focus-within:border-amber-500 transition-colors ${errors.password ? "border-red-500" : "border-zinc-200"}`}>
                                <Lock className="text-zinc-400" size={16} />
                                <Input
                                    type={isVisible ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                                />
                                <button type="button" onClick={toggleVisibility} className="text-zinc-400 focus:outline-none">
                                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </InputGroup>
                            {errors.password && <p className="text-[10px] text-red-500 mt-0.5">{errors.password}</p>}
                        </TextField>

                        <Button
                            type="submit"
                            className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-orange-950/10 hover:opacity-95 active:scale-[0.99] transition-all"
                            isDisabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </div>

                {/* Right Side: Animation */}
                <AuthAnimation />
            </div>
        </div>
    );
}