"use client";

import React, { useState, useEffect } from 'react';
import {
    BookOpen, Heart, FileText, Star, TrendingUp,
    Clock, Plus, Search, User, Edit, Trash2,
    Calendar, Eye, MessageSquare, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { authClient } from '../lib/auth-client';

// --- TYPES ---
// --- TYPES ---
interface Application {
    _id: string;
    title: string;
    university: string;
    status?: string;
    appliedAt: string;
}

interface ScholarshipSummary {
    _id: string;
    title: string;
    universityName: string;
    country: string;
    rating?: number;
    views?: number;
    reviewsCount?: number;
}

interface SavedScholarship {
    _id: string;
    title: string;
    university: string;
    country: string;
    fundingType: string;
}

interface ReviewItem {
    _id: string;
    title: string;
    rating: number;
    reviewText: string;
}

interface UpcomingDeadline {
    title: string;
    deadline: string;
}

interface DashboardData {
    stats: {
        myScholarships: number;
        saved: number;
        applications: number;
        reviews: number;
    };
    performance: {
        totalViews: number;
        averageRating: number;
        totalReviews: number;
        popularityScore: number;
    };
    recentApplications: Application[];
    myScholarships: ScholarshipSummary[];
    savedScholarships: SavedScholarship[];
    recentReviews: ReviewItem[];
    upcomingDeadlines: UpcomingDeadline[];
}

export default function DashboardUI() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const tokenResponse = await authClient.token();
                const token: string | undefined = tokenResponse?.data?.token;
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Calculate days remaining helper function
    const getDaysLeft = (deadlineDate: string) => {
        const diff = new Date(deadlineDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            👋 Welcome Back!
                        </h1>
                        <p className="text-gray-500 mt-1">Track your scholarships and applications in one place.</p>
                    </div>
                </div>

                {/* STATS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600"><BookOpen className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">My Scholarships</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.stats.myScholarships}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-rose-100 text-rose-600"><Heart className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Saved</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.stats.saved}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-purple-100 text-purple-600"><FileText className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Applications</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.stats.applications}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600"><Star className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Reviews</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.stats.reviews}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* RECENT APPLICATIONS */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">📝 Recent Applications</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-sm text-gray-500">
                                            <th className="pb-3 font-medium">Scholarship</th>
                                            <th className="pb-3 font-medium">University</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Applied Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {data.recentApplications.length === 0 ? (
                                            <tr><td colSpan={4} className="py-4 text-center text-gray-500">No applications yet.</td></tr>
                                        ) : (
                                            data.recentApplications.map((app) => (
                                                <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 font-medium text-gray-900">{app.title}</td>
                                                    <td className="py-3 text-gray-600">{app.university}</td>
                                                    <td className="py-3">
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                            {app.status || 'Submitted'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-gray-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* MY SCHOLARSHIPS */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">📚 My Scholarships</h2>
                            <div className="space-y-4">
                                {data.myScholarships.map((scholarship) => (
                                    <div key={scholarship._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:border-blue-200">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{scholarship.title}</h3>
                                            <p className="text-sm text-gray-500 mb-2">{scholarship.universityName} • {scholarship.country}</p>
                                            <div className="flex gap-4 text-xs font-medium text-gray-500">
                                                <span className="flex items-center gap-1 text-yellow-600"><Star className="w-3 h-3 fill-current" /> {scholarship.rating || 0}</span>
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {scholarship.views || 0}</span>
                                                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {scholarship.reviewsCount || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-8">

                        {/* UPCOMING DEADLINES */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-rose-500" /> Upcoming Deadlines
                            </h2>
                            <div className="space-y-4">
                                {data.upcomingDeadlines.length === 0 ? (
                                    <p className="text-sm text-gray-500">No upcoming deadlines.</p>
                                ) : (
                                    data.upcomingDeadlines.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div>
                                                <h4 className="font-medium text-gray-900 text-sm truncate max-w-[150px]">{item.title}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Calendar className="w-3 h-3" /> {new Date(item.deadline).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-md text-xs font-bold text-center">
                                                {getDaysLeft(item.deadline)}<br />Days
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RECENT REVIEWS */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" /> My Recent Reviews
                            </h2>
                            <div className="space-y-4">
                                {data.recentReviews.map((review) => (
                                    <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm text-gray-900 truncate">{review.title}</h4>
                                            <span className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
                                                <Star className="w-3 h-3 fill-current mr-1" /> {review.rating}.0
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic mb-2 line-clamp-2">"{review.reviewText}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* SAVED SCHOLARSHIPS (Full Width Bottom Section) */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500 fill-current" /> ❤️ Saved Scholarships
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.savedScholarships.map((saved) => (
                            <div key={saved._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow relative">
                                <button className="absolute top-4 right-4 text-rose-500 hover:text-rose-600">
                                    <Heart className="w-5 h-5 fill-current" />
                                </button>
                                <h3 className="font-bold text-gray-900 mt-2 pr-8 truncate">{saved.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{saved.university}</p>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-500">{saved.country}</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                        {saved.fundingType}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}