"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
    Search, 
    MapPin, 
    Calendar, 
    GraduationCap, 
    Banknote, 
    Star, 
    Filter,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

// Types based on your backend projection
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

export default function ScholarshipsPage() {
    // Data State
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    // Filter & Pagination State
    const [filters, setFilters] = useState({
        search: "",
        country: "",
        degree: "",
        fundingType: "",
        sort: "createdAt", // Default: Newest
        page: 1,
    });

    // Handle input changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1, // Reset to page 1 on any filter change
        }));
    };

    // Handle Search Submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchScholarships();
    };

    // Fetch Data
    const fetchScholarships = useCallback(async () => {
        console.log("fetchScholarships called");
    
        setIsLoading(true);
        setError(null);
    
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
            const queryParams = new URLSearchParams({
                page: filters.page.toString(),
                limit: "9",
                sort: filters.sort,
            });
    
            if (filters.search) queryParams.append("search", filters.search);
            if (filters.country) queryParams.append("country", filters.country);
            if (filters.degree) queryParams.append("degree", filters.degree);
            if (filters.fundingType) queryParams.append("fundingType", filters.fundingType);
    
            console.log(`${apiUrl}/scholarships?${queryParams}`);
    
            // 1. Fetch the token (assuming you imported authClient)
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;
    
            // 2. Attach the token to the fetch request
            const response = await fetch(
                `${apiUrl}/scholarships?${queryParams.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Ensure this is sent!
                    }
                }
            );
    
            console.log(response.status);
    
            const data = await response.json();
            console.log(data);
    
            // 3. Use the safe fallback to prevent crashes!
            setScholarships(data.scholarships || []);
            setTotalPages(data.totalPages || 1);
    
        } catch (err) {
            console.log(err);
            // Ensure state is safe even if the network completely fails
            setScholarships([]); 
            setError("Failed to fetch scholarships");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Re-fetch when page, sort, or direct selects change
    useEffect(() => {
        // We use a small timeout to debounce typing in the search if we wanted, 
        // but for selects and page changes, fetch immediately.
        fetchScholarships();
    }, [filters.page, filters.sort, filters.country, filters.degree, filters.fundingType, fetchScholarships]);


    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">Browse Scholarships</h1>
                    <p className="text-slate-500 mt-2 text-lg">Find fully funded opportunities to study abroad.</p>
                </div>

                {/* Top Controls: Search, Filters, Sorting */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        
                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="w-full md:w-1/3 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search by title or university..."
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </form>

                        {/* Dropdown Filters */}
                        <div className="flex flex-wrap w-full md:w-auto gap-3 flex-1 md:justify-end">
                            <select name="degree" value={filters.degree} onChange={handleFilterChange} className="p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="">All Degrees</option>
                                <option value="Bachelor">Bachelor</option>
                                <option value="Master">Master</option>
                                <option value="PhD">PhD</option>
                            </select>

                            <select name="fundingType" value={filters.fundingType} onChange={handleFilterChange} className="p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="">All Funding</option>
                                <option value="Fully Funded">Fully Funded</option>
                                <option value="Partial Funded">Partial Funded</option>
                                <option value="Tuition Waiver">Tuition Waiver</option>
                            </select>
                            
                            {/* Example Country Filter - Ideally populated dynamically from DB */}
                            <select name="country" value={filters.country} onChange={handleFilterChange} className="p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="">All Countries</option>
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Japan">Japan</option>
                                <option value="Germany">Germany</option>
                            </select>

                            <div className="h-10 w-px bg-slate-200 hidden lg:block mx-2"></div>

                            {/* Sorting */}
                            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="p-2.5 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
                                <option value="createdAt">Newest First</option>
                                <option value="applicationDeadline">Deadline: Closing Soon</option>
                                <option value="popularity">Most Popular</option>
                                <option value="title">A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button onClick={fetchScholarships} className="mt-4 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Try Again</button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
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

                {/* Empty State */}
                {!isLoading && !error && scholarships.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900">No scholarships found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                        <button 
                            onClick={() => setFilters({ search: "", country: "", degree: "", fundingType: "", sort: "createdAt", page: 1 })}
                            className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Data Grid */}
                {!isLoading && !error && scholarships.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {scholarships.map((scholarship) => (
                            <div key={scholarship._id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                
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
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                        {scholarship.rating > 0 ? scholarship.rating.toFixed(1) : "New"}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex gap-2 mb-3 flex-wrap">
                                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                            {scholarship.degree}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded">
                                            {scholarship.fundingType}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
                                        {scholarship.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-1">{scholarship.universityName}</p>

                                    <div className="mt-auto space-y-2 mb-6">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <MapPin className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                                            <span className="truncate">{scholarship.country}</span>
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
                                        href={`/dashboard/scholarships/view/${scholarship._id}`}
                                        className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 rounded-lg transition-colors font-medium text-sm group"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button 
                            disabled={filters.page === 1}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="p-2 border rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                        filters.page === i + 1 
                                            ? "bg-blue-600 text-white" 
                                            : "bg-white text-slate-600 border hover:bg-slate-50"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            disabled={filters.page === totalPages}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="p-2 border rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}