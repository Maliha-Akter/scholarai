"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    MapPin, Calendar, GraduationCap, Star, Bookmark,
    ExternalLink, CheckCircle2, ChevronLeft, Award,
    AlertCircle, Send
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

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

// Extract constants outside the component to avoid unnecessary hook re-creations
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ScholarshipDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [data, setData] = useState<{
        scholarship: ScholarshipDetails | null;
        reviews: Review[];
        related: RelatedScholarship[];
    }>({ scholarship: null, reviews: [], related: [] });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Feature States
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    // Application Modal States
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    // Review Form States
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Helper to get Auth Headers
    const getAuthHeaders = useCallback(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
    }, []);

    const fetchDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/scholarships/${id}`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error("Failed to fetch scholarship details");

            const result = await response.json();
            setData({
                scholarship: result.scholarship || null,
                reviews: result.reviews || [],
                related: result.related || []
            });

            // Set dynamic user states from the extended API response
            setIsSaved(result.saved || false);
            setHasApplied(result.applied || false);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [id, getAuthHeaders]);

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id, fetchDetails]);
    // Define explicit type for the status response if desired
    interface SavedStatusResponse {
        isSaved: boolean;
        message?: string;
    }

    // Inside your main React Component:
    useEffect(() => {
        const checkInitialSavedStatus = async (): Promise<void> => {
            // Only trigger the request once the scholarship data has successfully resolved
            if (!data?.scholarship?._id) return;

            // Fetch user token securely via auth client
            const tokenResponse = await authClient.token();
            const token: string | undefined = tokenResponse?.data?.token;

            // If the user is a guest, exit out and leave button as "Save for later"
            if (!token) return;

            try {
                const response = await fetch(`${API_URL}/saved/status/${data.scholarship._id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const result: SavedStatusResponse = await response.json();
                    // Persist the verified database state into your React hook state
                    setIsSaved(result.isSaved);
                }
            } catch (error) {
                console.error("Failed to fetch initial saved status:", error);
            }
        };

        checkInitialSavedStatus();
    }, [data?.scholarship?._id]); // Dependency array tracks initialization changes

    // --- Actions ---

    const handleSave = async (): Promise<void> => {
        const tokenResponse = await authClient.token();
        const token: string | undefined = tokenResponse?.data?.token;

        if (!token) {
            toast.error("Please log in to save scholarships.");
            return;
        }

        if (!data.scholarship?._id) {
            toast.error("Scholarship data is still loading. Please wait.");
            return;
        }

        // Optimistic UI update to bypass network roundtrip delays
        const previousSavedState: boolean = isSaved;
        setIsSaved(!previousSavedState);
        setIsSaving(true);

        try {
            // Always send a POST request; your backend toggle handles insertion vs eviction internally
            const response = await fetch(`${API_URL}/saved`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ scholarshipId: data.scholarship._id })
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Unauthorized");
                throw new Error("ServerError");
            }

            const result: { message: string; saved: boolean } = await response.json();

            if (result && typeof result.saved !== 'undefined') {
                setIsSaved(result.saved);

                // Trigger specific toast based on the boolean returned by the backend
                if (result.saved) {
                    toast.success("Scholarship saved successfully!");
                } else {
                    toast.success("Scholarship removed from saved items.");
                }
            }
        } catch (error) {
            console.error("Save execution error:", error);
            // Rollback state if network transaction fails
            setIsSaved(previousSavedState);

            if (error instanceof Error && error.message === "Unauthorized") {
                toast.error("Your session has expired. Please log in again.");
            } else {
                toast.error("Could not update saved status. Please try again.");
            }
        } finally {
            setIsSaving(false);
        }
    };
    interface ApplicationStatusResponse {
        hasApplied: boolean;
    }

    useEffect(() => {
        const checkInitialApplicationStatus = async (): Promise<void> => {
            // Only trigger the request once the scholarship data has successfully resolved
            if (!data?.scholarship?._id) return;

            // Fetch user token securely via auth client
            const tokenResponse = await authClient.token();
            const token: string | undefined = tokenResponse?.data?.token;

            // If the user is a guest, exit out and leave button as "Apply Now"
            if (!token) return;

            try {
                const response = await fetch(`${API_URL}/applications/status/${data.scholarship._id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const result: ApplicationStatusResponse = await response.json();
                    // Persist the verified database state into your React hook state
                    setHasApplied(result.hasApplied);
                }
            } catch (error) {
                console.error("Failed to fetch initial application status:", error);
            }
        };

        checkInitialApplicationStatus();
    }, [data?.scholarship?._id]);
    const handleApply = async (): Promise<void> => {
        // 1. Check if the user is authenticated
        const tokenResponse = await authClient.token();
        const token: string | undefined = tokenResponse?.data?.token;
        if (!token) {
            toast.error("Please log in to track your applications.");
            return;
        }

        if (!data.scholarship || !data.scholarship._id) {
            toast.error("Scholarship data is still loading. Please wait.");
            return;
        }

        setIsApplying(true);
        try {
            const response = await fetch(`${API_URL}/applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ scholarshipId: data.scholarship._id })
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Unauthorized");

                // Handle duplicate case: notify user and reload after 3 seconds
                if (response.status === 409) {
                    setHasApplied(true);
                    setShowApplyModal(false);
                    toast.info("Application already recorded! Refreshing in 3 seconds...");

                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                    return;
                }
                throw new Error("Failed to track application");
            }

            // 2. Successful insertion update states
            setHasApplied(true);
            setShowApplyModal(false);
            toast.success("Application recorded! Refreshing in 3 seconds...");

            // 3. Trigger delayed page refresh
            setTimeout(() => {
                window.location.reload();
            }, 5000);

        } catch (error) {
            console.error("Error tracking application:", error);

            if (error instanceof Error && error.message === "Unauthorized") {
                toast.error("Your session has expired. Please log in again.");
            } else {
                toast.error("Could not record application. Please try again.");
            }
        } finally {
            setIsApplying(false);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim() || !data.scholarship?._id) return;

        setIsSubmittingReview(true);
        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    scholarshipId: data.scholarship._id, // <-- FIX HERE
                    rating: reviewRating,
                    review: reviewText
                })
            });

            if (response.ok) {
                setReviewText("");
                setReviewRating(5);
                await fetchDetails();
            } else {
                throw new Error("Failed to submit review");
            }
        } catch (error) {
            console.error("Error posting review:", error);
            alert("Could not submit your review. Please try again later.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // --- Loading & Error States ---
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
                <p className="text-slate-500 mb-6">{error || "The scholarship you are looking for does not exist."}</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Go Back
                </button>
            </div>
        );
    }

    const { scholarship, reviews, related } = data;

    // Safely parse the deadline
    const parsedDeadline = new Date(scholarship.applicationDeadline);
    const deadlineString = !isNaN(parsedDeadline.getTime())
        ? parsedDeadline.toLocaleDateString()
        : "TBA";

    return (
        <div className="min-h-screen bg-slate-50 pb-20 relative">
            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">You are leaving ScholarAI</h3>
                        <p className="text-slate-600 mb-6">
                            You will be redirected to the official scholarship portal. We will save this in your Application History so you can track your progress.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center disabled:opacity-70 transition-colors"
                            >
                                {isApplying ? "Tracking..." : "Continue to Apply"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                        Deadline: <span className="text-slate-900">{deadlineString}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        if (hasApplied) {
                                            toast.info("Refreshing page in 3 seconds...");
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 3000);
                                        } else {
                                            setShowApplyModal(true);
                                        }
                                    }}
                                    className={`flex-1 flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-colors ${hasApplied
                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {hasApplied ? (
                                        <><CheckCircle2 className="w-5 h-5" /> Already Applied</>
                                    ) : (
                                        <><ExternalLink className="w-5 h-5" /> Apply Now</>
                                    )}
                                </button>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border transition-all ${isSaved
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

                        {/* Reviews Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Student Reviews</h2>
                                <span className="text-slate-500 font-medium">{reviews.length} reviews</span>
                            </div>

                            {/* Write a Review Box */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                                <h3 className="font-bold text-slate-900 mb-4">Leave a review</h3>
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="flex items-center mb-4 gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className="focus:outline-none transition-colors"
                                            >
                                                <Star className={`w-6 h-6 ${reviewRating >= star ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
                                        placeholder="Share your experience or thoughts on this scholarship..."
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingReview || !reviewText.trim()}
                                            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
                                        >
                                            <Send className="w-4 h-4" /> {isSubmittingReview ? "Submitting..." : "Submit Review"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Review List */}
                            {reviews.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
                                    No reviews yet. Be the first to review this scholarship!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map(review => {
                                        const reviewDate = new Date(review.createdAt);
                                        const formattedDate = !isNaN(reviewDate.getTime())
                                            ? reviewDate.toLocaleDateString()
                                            : "Recent";

                                        return (
                                            <div key={review._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg mr-3">
                                                            {review.author?.name?.charAt(0) || "U"}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{review.author?.name || "Anonymous User"}</p>
                                                            <p className="text-xs text-slate-500">{formattedDate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                                        <span className="font-bold text-slate-700">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-700 leading-relaxed">{review.review}</p>
                                            </div>
                                        )
                                    })}
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
                                                    <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <GraduationCap className="w-8 h-8 opacity-50" />
                                                            </div>
                                                        )}
                                                    </div>
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