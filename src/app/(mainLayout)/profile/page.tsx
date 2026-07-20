"use client";

import React, { useState, useRef } from "react";
import { Card, Button, Input, Spinner } from "@heroui/react";
import { User, Mail, Shield, Edit3, Save, X, Upload, Loader2, Award } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    role: string;
    createdAt: string;
}

export default function UserProfilePage() {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // 💡 No useEffect needed! We initialize empty and populate onClick when editing starts.
    const [formData, setFormData] = useState({
        name: "",
        image: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("image", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadData
            });
            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.data.url }));
                toast.success("Profile image uploaded!");
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to upload image.";
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await authClient.updateUser({
                name: formData.name,
                image: formData.image,
            });

            if (res.error) {
                throw new Error(res.error.message || "Failed to update profile.");
            }

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
            console.error("Profile Update Error:", err);
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (sessionLoading) {
        return (
            <div className="flex flex-col gap-3 h-[70vh] items-center justify-center bg-[#F8FAFC]">
                <Spinner color="accent" size="lg" />
                <span className="text-sm font-medium text-slate-500">Syncing authentication state...</span>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="max-w-xl mx-auto text-center mt-12 bg-[#F8FAFC] p-6 rounded-2xl">
                <p className="text-slate-500 text-sm">No authorized session found. Please log in.</p>
            </div>
        );
    }

    const user = session.user as unknown as UserProfile;

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <Card className="p-8 border border-slate-200/80 shadow-xl bg-white rounded-3xl relative overflow-hidden">
                    {/* Top Gradient Banner: Midnight Blue -> Violet -> Gold */}
                    <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#1D4ED8] via-[#7C3AED] to-[#FBBF24]" />

                    <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 mb-6">
                        {/* Avatar Framed with Violet/Blue accents */}
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#7C3AED]/30 ring-4 ring-[#1D4ED8]/10 shadow-sm shrink-0 bg-slate-50 flex items-center justify-center relative">
                            {isUploading ? (
                                <Loader2 className="animate-spin text-[#7C3AED]" />
                            ) : (
                                <img
                                    src={isEditing ? (formData.image || user.image) : user.image}
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`;
                                    }}
                                />
                            )}
                        </div>

                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">{user.name}</h1>
                            {/* Role Badge: Violet & Gold Award Style */}
                            <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest mt-1 px-3 py-1 bg-gradient-to-r from-[#7C3AED]/10 via-[#7C3AED]/5 to-[#FBBF24]/15 border border-[#7C3AED]/20 rounded-full inline-flex items-center gap-1">
                                <Award size={12} className="text-[#FBBF24]" />
                                {user.role || "user"} Account
                            </p>
                        </div>

                        {!isEditing && (
                            <Button
                                onClick={() => {
                                    // 💡 We populate state cleanly inside the click handler!
                                    setFormData({
                                        name: user.name || "",
                                        image: user.image || ""
                                    });
                                    setIsEditing(true);
                                }}
                                size="sm"
                                className="rounded-xl font-bold text-xs bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white shadow-md shadow-[#1D4ED8]/15 flex items-center gap-1.5 px-4 transition-all"
                            >
                                <Edit3 size={14} /> Edit Profile
                            </Button>
                        )}
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Name Input Field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                    <User size={14} className="text-[#1D4ED8]" /> Full Name
                                </label>
                                <Input
                                    disabled={!isEditing}
                                    type="text"
                                    name="name"
                                    value={isEditing ? formData.name : (user.name || "")}
                                    onChange={handleInputChange}
                                    required
                                    className="focus-within:border-[#7C3AED] transition-colors"
                                />
                            </div>

                            {/* Profile Image URL Input Field */}
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                        <Shield size={14} className="text-[#7C3AED]" /> Profile Image URL
                                    </label>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="text-xs font-bold text-[#7C3AED] hover:text-[#1D4ED8] hover:underline flex items-center gap-1 transition-colors"
                                        >
                                            {isUploading ? "Uploading..." : <><Upload size={12} className="text-[#FBBF24]" /> Upload File</>}
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Input
                                    disabled={!isEditing || isUploading}
                                    type="url"
                                    name="image"
                                    pattern="https?://.+"
                                    value={isEditing ? formData.image : (user.image || "")}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/avatar.jpg"
                                    required
                                    className="focus-within:border-[#7C3AED] transition-colors"
                                />
                            </div>

                            {/* Email Input Field */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                    <Mail size={14} className="text-[#1D4ED8]" /> Email Address
                                </label>
                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        disabled
                                        type="email"
                                        value={user.email}
                                        className="flex-1"
                                    />
                                    <span className={`text-[10px] font-bold px-3 py-2 rounded-xl shrink-0 border ${
                                        user.emailVerified
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                        {user.emailVerified ? "Verified" : "Pending"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({ name: user.name || "", image: user.image || "" });
                                    }}
                                    className="rounded-xl font-semibold text-sm border border-slate-200 bg-white hover:bg-slate-50 text-[#0F172A]"
                                >
                                    <X size={15} /> Cancel
                                </Button>
                                {/* Save Button: Midnight Blue to Violet Gradient */}
                                <Button
                                    type="submit"
                                    isDisabled={isSaving}
                                    className={`flex items-center gap-2 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] hover:opacity-95 text-white shadow-lg shadow-[#7C3AED]/25 px-6 transition-all ${
                                        isSaving ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSaving ? <Loader2 size={15} className="animate-spin text-[#FBBF24]" /> : <Save size={15} className="text-[#FBBF24]" />}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </form>
                </Card>
            </div>
        </div>
    );
}