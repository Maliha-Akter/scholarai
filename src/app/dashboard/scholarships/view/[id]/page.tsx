"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
    MapPin, Calendar, GraduationCap, Star, Bookmark, 
    ExternalLink, CheckCircle2, ChevronLeft, Globe, 
    Briefcase, FileText, Award, AlertCircle
} from "lucide-react";

// --- Types ---
interface Eligibility {
    minimumCgpa?: string;
    ielts?: string;
    toefl?: string;
    ageLimit?: string;
    nationality?: string;
    acceptedDegree?: string;
    workExperience?: string;
}

interface Funding {
    tuitionCoverage?: string;
    accommodation?: string;
    monthlyStipend?: string;
    travel?: string;
    insurance?: string;
    visaSupport?: string;
    otherBenefits?: string;
}

interface Review {
    _id: string;
    rating: number;
    review: string;
    createdAt: string;
    author: {
        name: string;
        image?: string;
    };
}

interface RelatedScholarship {
    _id: string;
    image?: string;
    title: string;
    universityName: string;
    country: string;
    degree: string;
    fundingType: string;
    applicationDeadline: string;
    rating: number;
}

interface ScholarshipDetails {
    _id: string;
    image?: string;
    title: string;
    universityName: string;
    country: string;
    fundingType: string;
    degree: string;
    applicationDeadline: string;
    rating: number;
    applicationUrl: string;
    overview: string;
    eligibility: Eligibility;
    funding: Funding;
    requiredDocuments: string[];
}

export default function ScholarshipDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [data, setData] = useState<{
        scholarship: ScholarshipDetails | null;
        reviews: Review[];
        related: RelatedScholarship[];
    }>({ scholarship: null, reviews: [], related: [] });
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // You can sync this with actual user data later

    const fetchDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${apiUrl}/scholarships/${id}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch scholarship details");
            }

            const result = await response.json();
            setData(result);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchDetails();
    }, [id, fetchDetails]);

    const handleSave = async () => {
        // Integrate with your existing POST /saved endpoint here
        setIsSaving(true);
        try {
            // const token = localStorage.getItem('token') || ... 
            // await fetch('/saved', { method: 'POST', body: { scholarshipId: id } })
            setIsSaved(!isSaved); // Optimistic UI update
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !data.scholarship) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Scholarship Not Found</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
            </div>
        );
    }

    const { scholarship, reviews, related } = data;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button onClick={() => router.back()} className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Search
                    </button>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Image */}
                        <div className="w-full lg:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            {scholarship.image ? (
                                <img src={scholarship.image} alt={scholarship.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <GraduationCap className="w-20 h-20 opacity-30" />
                                </div>
                            )}
                        </div>

                        {/* Core Details */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">{scholarship.degree}</span>
                                <span className="bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">{scholarship.fundingType}</span>
                                <span className="flex items-center text-sm font-bold text-slate-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    {scholarship.rating > 0 ? scholarship.rating.toFixed(1) : "New"}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-2">
                                {scholarship.title}
                            </h1>
                            <p className="text-xl text-slate-600 mb-6 font-medium">{scholarship.universityName}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center text-slate-600">
                                    <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                                    <span className="font-medium">{scholarship.country}</span>
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                                    <span className="font-medium">
                                        Deadline: <span className="text-slate-900">{new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                                <a 
                                    href={scholarship.applicationUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Apply Now <ExternalLink className="w-5 h-5" />
                                </a>
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border transition-all ${
                                        isSaved 
                                        ? "bg-slate-900 text-white border-slate-900" 
                                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                                    {isSaved ? "Saved" : "Save for later"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Left Column: Extensive Details */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {scholarship.overview}
                            </p>
                        </section>

                        {/* Eligibility */}
                        {scholarship.eligibility && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Eligibility Requirements</h2>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    {Object.entries(scholarship.eligibility).map(([key, value]) => {
                                        if (!value) return null;
                                        // Formatting camelCase keys for display
                                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                        return (
                                            <div key={key}>
                                                <p className="text-sm text-slate-500 mb-1">{label}</p>
                                                <p className="font-semibold text-slate-900">{value}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Benefits/Funding */}
                        {scholarship.funding && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Financial Benefits</h2>
                                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(scholarship.funding).map(([key, value]) => {
                                        if (!value) return null;
                                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                        return (
                                            <div key={key} className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                                <Award className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{label}</p>
                                                    <p className="text-sm text-slate-600 mt-1">{value}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Required Documents */}
                        {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Required Documents</h2>
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {scholarship.requiredDocuments.map((doc, index) => (
                                            <li key={index} className="flex items-center text-slate-700">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                                                {doc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}

                        {/* Reviews */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Student Reviews</h2>
                                <span className="text-slate-500 font-medium">{reviews.length} reviews</span>
                            </div>
                            
                            {reviews.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
                                    No reviews yet. Be the first to review this scholarship!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg mr-3">
                                                        {review.author?.name?.charAt(0) || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{review.author?.name || "Anonymous User"}</p>
                                                        <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                                    <span className="font-bold text-slate-700">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-700 leading-relaxed">{review.review}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Related Scholarships Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Similar Scholarships</h3>
                            
                            {related.length === 0 ? (
                                <p className="text-slate-500">No similar scholarships found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {related.map(item => (
                                        <Link href={`/dashboard/scholarships/view/${item._id}`} key={item._id} className="block group">
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex gap-4">
                                                    {/* Thumbnail */}
                                                    <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <GraduationCap className="w-8 h-8 opacity-50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Mini Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 line-clamp-1 mb-2">{item.universityName}</p>
                                                        
                                                        <div className="flex flex-wrap gap-1">
                                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                                                                {item.country}
                                                            </span>
                                                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                                                                {item.fundingType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}