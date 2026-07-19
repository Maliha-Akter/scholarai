"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    User as UserIcon,
    Bookmark,
    History,
    Sparkles,
    FilePlus,
    Files,
    Settings,
    LogOut, 
    Loader2, 
    X,
    GraduationCap
} from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';
import { type User } from '@/app/lib/auth';
import { toast } from 'react-toastify';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { data: session } = authClient.useSession();
    const user = session?.user as User | undefined;

    // ScholarAI Dashboard Links
    const sidebarLinks = [
        {
            label: 'Dashboard Home',
            href: '/dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />
        },
        { 
            label: 'Profile', 
            href: '/dashboard/profile', 
            icon: <UserIcon className="w-5 h-5" /> 
        },
        { 
            label: 'Saved Scholarships', 
            href: '/dashboard/saved', 
            icon: <Bookmark className="w-5 h-5" /> 
        },
        { 
            label: 'Application History', 
            href: '/dashboard/history', 
            icon: <History className="w-5 h-5" /> 
        },
        { 
            label: 'AI Assistant', 
            href: '/ai-assistant', 
            icon: <Sparkles className="w-5 h-5" /> 
        },
        { 
            label: 'Add New Scholarship', 
            href: '/dashboard/scholarships/add', 
            icon: <FilePlus className="w-5 h-5" /> 
        },
        { 
            label: 'Manage Documents', 
            href: '/dashboard/documents', 
            icon: <Files className="w-5 h-5" /> 
        },
        { 
            label: 'Settings', 
            href: '/dashboard/settings', 
            icon: <Settings className="w-5 h-5" /> 
        },
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully!");
                        window.location.href = "/";
                    },
                },
            });
        } catch (error) {
            toast.error("Failed to log out cleanly.");
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-700 flex flex-col justify-between border-r border-blue-100 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
                    isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                }`}
            >
                {/* Top Brand Section */}
                <div>
                    <div className="h-16 flex items-center justify-between px-6 border-b border-blue-100 bg-[#F8FAFC]">
                        <Link 
                            href="/" 
                            className="text-xl font-bold flex items-center gap-2 group"
                            onClick={() => onClose()} 
                        >
                            <div className="bg-[#1D4ED8] text-[#FBBF24] p-1.5 rounded-lg shadow-sm transition-transform group-hover:scale-105">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <span className="text-[#0F172A] tracking-tight">
                                Scholar<span className="text-[#7C3AED]">AI</span>
                            </span>
                        </Link>

                        {/* Mobile Close Button */}
                        <button 
                            onClick={onClose} 
                            className="md:hidden text-slate-400 hover:text-[#1D4ED8] p-1 rounded-lg hover:bg-blue-50 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => onClose()}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-blue-50 text-[#1D4ED8] font-semibold border-l-4 border-[#1D4ED8]"
                                            : "text-slate-600 hover:text-[#1D4ED8] hover:bg-slate-50 border-l-4 border-transparent"
                                    }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Profile / Logout Action Footer */}
                <div className="p-4 border-t border-blue-100 bg-[#F8FAFC] shrink-0">
                    {user && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-white">
                                {user.image ? (
                                    <img src={user.image} alt="User Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-sm">
                                        {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                                    </span>
                                )}
                            </div>
                            <div className="truncate min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            <>
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}