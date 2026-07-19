"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
    MapPin, 
    Calendar, 
    GraduationCap, 
    Star, 
    ArrowLeft,
    Landmark,
    SearchX,
    ArrowRight
} from "lucide-react";

// Types matching your backend response
interface UniversityInfo {
    universityName: string;
    country: string;
    city: string;
    totalScholarships: number;
}

interface Scholarship {
    _id: string;
    slug: string;
    image?: string;
    title: string;
    universityName: string;
    country: string;
    degree: string;
    fundingType: string;
    applicationDeadline: string;
    rating: number;
}

export default function UniversityPage() {
    const params = useParams();
    // Safely get and decode the dynamic parameter from the URL
    const rawUniversityName = params?.universityName as string || "";
    const decodedUniversityName = decodeURIComponent(rawUniversityName);

    const [universityInfo, setUniversityInfo] = useState<UniversityInfo | null>(null);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUniversityData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            
            // Calling your newly created endpoint
            const response = await fetch(
                `${apiUrl}/universities/${encodeURIComponent(decodedUniversityName)}`
            );

            if (response.status === 404) {
                setScholarships([]);
                setUniversityInfo(null);
                setIsLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch university data");
            }

            const data = await response.json();
            
            setUniversityInfo(data.universityInfo);
            setScholarships(data.scholarships);

        } catch (err) {
            console.error(err);
            setError("Something went wrong while loading the university details.");
        } finally {
            setIsLoading(false);
        }
    }, [decodedUniversityName]);

    useEffect(() => {
        if (decodedUniversityName) {
            fetchUniversityData();
        }
    }, [decodedUniversityName, fetchUniversityData]);

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Back Button */}
                <Link 
                    href="/universities" 
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to All Universities
                </Link>

                {/* Loading State for Header */}
                {isLoading && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-10 animate-pulse">
                        <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-6"></div>
                        <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
                        <div className="flex gap-4">
                            <div className="h-5 bg-slate-200 rounded w-24"></div>
                            <div className="h-5 bg-slate-200 rounded w-32"></div>
                        </div>
                    </div>
                )}

                {/* University Header Section */}
                {!isLoading && universityInfo && (
                    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 mb-10 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                <Landmark className="w-8 h-8" />
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                {universityInfo.universityName}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 text-slate-600">
                                <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                                    {universityInfo.city ? `${universityInfo.city}, ` : ''}{universityInfo.country}
                                </div>
                                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                    <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                                    {universityInfo.totalScholarships} Active {universityInfo.totalScholarships === 1 ? 'Scholarship' : 'Scholarships'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
                        <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
                        <button onClick={fetchUniversityData} className="text-sm bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-medium transition-colors">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State (404 / No scholarships found) */}
                {!isLoading && !error && scholarships.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <SearchX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No scholarships found</h3>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">We couldn't find any active scholarships for "{decodedUniversityName}" at this time.</p>
                        <Link href="/universities" className="inline-block mt-8 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-6 py-2.5 rounded-lg transition-colors">
                            Browse other universities
                        </Link>
                    </div>
                )}

                {/* Scholarships Section */}
                {!isLoading && !error && scholarships.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                            Available Programs
                            <span className="ml-3 bg-slate-200 text-slate-700 py-0.5 px-2.5 rounded-full text-sm font-semibold">
                                {scholarships.length}
                            </span>
                        </h2>

                        {/* Exact Same Scholarship Grid from ScholarshipsPage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {scholarships.map((scholarship) => (
                                <div key={scholarship._id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    
                                    {/* Card Image */}
                                    <div className="relative h-48 bg-slate-100 flex-shrink-0 overflow-hidden">
                                        {scholarship.image ? (
                                            <img 
                                                src={scholarship.image} 
                                                alt={scholarship.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <GraduationCap className="w-12 h-12 opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                            {scholarship.rating > 0 ? scholarship.rating.toFixed(1) : "New"}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                                                {scholarship.degree}
                                            </span>
                                            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                                                {scholarship.fundingType}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2">
                                            {scholarship.title}
                                        </h3>
                                        
                                        <div className="mt-auto space-y-2 mb-6 pt-4 border-t border-slate-50">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{scholarship.universityName}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Calendar className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                                                <span className={new Date(scholarship.applicationDeadline) < new Date() ? "text-red-500 font-medium" : ""}>
                                                    Deadline: {scholarship.applicationDeadline ? new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Ongoing"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link 
                                            href={`/dashboard/scholarships/view/${scholarship.slug || scholarship._id}`}
                                            className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 rounded-lg transition-colors font-medium text-sm group"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State for Cards */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl h-[420px] shadow-sm border border-slate-100 animate-pulse">
                                <div className="h-48 bg-slate-200 rounded-t-xl w-full"></div>
                                <div className="p-5 space-y-4">
                                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    <div className="space-y-2 mt-4">
                                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}