"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import {
    Menu, X, LogOut, User as UserIcon, LayoutDashboard,
    GraduationCap, Building2, BookOpen, MessageSquare, Sparkles,
    Bookmark, History, Files
} from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';
import { type User } from '@/app/lib/auth';
import { toast } from 'react-toastify';

interface NavLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [imageError, setImageError] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Live session polling from better-auth
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user as User | undefined;
    const isLoggedIn = !!user;

    // Handle clicking outside to close menus cleanly
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsProfileDropdownOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(target) && !target.closest('.hamburger-btn')) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loggedOutLinks: NavLink[] = [
        { label: 'Scholarships', href: '/scholarships/view', icon: <BookOpen className="w-4 h-4 mr-1.5" /> },
        { label: 'Universities', href: '/universities', icon: <Building2 className="w-4 h-4 mr-1.5" /> },
        // { label: 'Help & Support', href: '/help', icon: <MessageSquare className="w-4 h-4 mr-1.5" /> },
        { label: 'About Us', href: '/about', icon: <Sparkles className="w-4 h-4 mr-1.5" /> },
        { label: 'Contact', href: '/contact', icon: <Sparkles className="w-4 h-4 mr-1.5" /> },
    ];

    const loggedInLinks: NavLink[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: <LayoutDashboard className="w-4 h-4 mr-1.5" />
        },
        {
            label: 'Scholarships',
            href: '/scholarships/view',
            icon: <BookOpen className="w-4 h-4 mr-1.5" />
        },
        {
            label: 'AI Assistant',
            href: '/ai-assistant',
            icon: <Sparkles className="w-4 h-4 mr-1.5" />
        },
        {
            label: 'AI Scholarship Recommender',
            href: '/ai-recommender',
            icon: <Sparkles className="w-4 h-4 mr-1.5" />
        },
        {
            label: 'Profile',
            href: '/profile',
            icon: <UserIcon className="w-4 h-4 mr-1.5" />
        },
        // {
        //     label: 'About Us',
        //     href: '/about',
        //     icon: <Sparkles className="w-4 h-4 mr-1.5" />
        // }

    ];

    const activeLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setIsProfileDropdownOpen(false);
        setIsOpen(false);
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

    if (isPending) {
        return <div className="w-full h-16 bg-[#F8FAFC] border-b border-blue-100 sticky top-0 z-50 animate-pulse" />;
    }

    return (
        <nav className="w-full bg-[#F8FAFC]/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Brand Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold flex items-center gap-2 group">
                            <div className="bg-[#1D4ED8] text-[#FBBF24] p-1.5 rounded-lg shadow-sm transition-transform group-hover:scale-105">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <span className="text-[#0F172A] tracking-tight">
                                Scholar<span className="text-[#7C3AED]">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* DESKTOP Links */}
                    <div className="hidden lg:flex space-x-8 items-center">
                        {activeLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${pathname === link.href
                                    ? "text-[#7C3AED] font-semibold"
                                    : "text-[#0F172A] hover:text-[#1D4ED8]"
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isLoggingOut ? (
                            <div className="flex items-center justify-center h-10 w-10">
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#1D4ED8] border-t-transparent"></span>
                            </div>
                        ) : isLoggedIn ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white font-bold overflow-hidden focus:outline-none hover:opacity-90 transition-opacity"
                                >
                                    {user?.image && !imageError ? (
                                        <img
                                            src={user.image}
                                            alt="User profile"
                                            className="h-full w-full object-cover"
                                            onError={() => setImageError(true)} // <-- Triggers the fallback if the image fails to load
                                        />
                                    ) : (
                                        <span>
                                            {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown Menu Context Window */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 top-12 mt-2 w-64 rounded-xl shadow-xl py-1 bg-white ring-1 ring-black/5 z-50 border border-slate-100 overflow-hidden">

                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                                            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                {user?.email}
                                                {user?.role && (
                                                    <span className="text-[10px] text-[#7C3AED] font-bold uppercase ml-1">
                                                        ({user.role})
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Dashboard Links */}
                                        <div className="py-1 border-b border-slate-100">
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8] font-medium transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4 mr-2.5 text-slate-400" /> My Dashboard
                                            </Link>
                                            <Link
                                                href="/dashboard/profile"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8] font-medium transition-colors"
                                            >
                                                <UserIcon className="w-4 h-4 mr-2.5 text-slate-400" /> Profile
                                            </Link>
                                            <Link
                                                href="/dashboard/scholarships/saved"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8] font-medium transition-colors"
                                            >
                                                <Bookmark className="w-4 h-4 mr-2.5 text-slate-400" /> Saved Scholarships
                                            </Link>
                                            <Link
                                                href="/dashboard/scholarships/application"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8] font-medium transition-colors"
                                            >
                                                <History className="w-4 h-4 mr-2.5 text-slate-400" /> Application History
                                            </Link>
                                            <Link
                                                href="/ai-assistant"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8] font-medium transition-colors"
                                            >
                                                <Sparkles className="w-4 h-4 mr-2.5 text-slate-400" /> AI Assistant
                                            </Link>
                                            <Link
                                                href="/dashboard/scholarships/manage"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1D4ED8] font-medium transition-colors"
                                            >
                                                <Files className="w-4 h-4 mr-2.5 text-slate-400" /> Manage Documents
                                            </Link>
                                        </div>

                                        {/* Logout Button */}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4 mr-2.5" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center space-x-4">
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-semibold text-[#0F172A] hover:text-[#1D4ED8] transition-colors px-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="text-sm font-bold text-white bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Hamburger Trigger */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="hamburger-btn text-[#0F172A] hover:text-[#1D4ED8] focus:outline-none p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                aria-label="Toggle Menu"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div> {/* <-- ADD THIS: Closes the "flex justify-between h-16" div */}
            </div>
            {/* Mobile Drawer */}
            {isOpen && (
                <div className="lg:hidden bg-white/95 border-t border-blue-100 px-4 pt-2 pb-4 space-y-1 shadow-inner backdrop-blur-lg" ref={menuRef}>
                    {activeLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all ${pathname === link.href
                                ? "text-[#7C3AED] bg-purple-50/50 font-semibold"
                                : "text-[#0F172A] hover:text-[#1D4ED8] hover:bg-blue-50/50"
                                }`}
                        >
                            <span className="mr-3">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}

                    {!isLoggedIn && (
                        <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col space-y-3 px-3">
                            <Link
                                href="/auth/login"
                                onClick={() => setIsOpen(false)}
                                className="text-center text-base font-semibold text-[#0F172A] hover:bg-slate-50 py-2.5 rounded-xl border border-slate-200 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                onClick={() => setIsOpen(false)}
                                className="text-center text-base font-bold text-white bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] py-2.5 rounded-xl transition-all shadow-md"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}