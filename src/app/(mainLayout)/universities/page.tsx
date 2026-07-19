"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
    Search, 
    MapPin, 
    GraduationCap, 
    Filter,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Landmark
} from "lucide-react";

// Types based on the aggregated data structure for universities
interface UniversitySummary {
    _id: string;
    universityName: string;
    country: string;
    city: string;
    totalScholarships: number;
}

export default function UniversitiesPage() {
    // Data State
    const [universities, setUniversities] = useState<UniversitySummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    // Filter & Pagination State
    const [filters, setFilters] = useState({
        search: "",
        country: "",
        sort: "universityName", // Default: A-Z
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
        fetchUniversities();
    };

    // Fetch Data
    const fetchUniversities = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

            const queryParams = new URLSearchParams({
                page: filters.page.toString(),
                limit: "12", // 12 universities per page
                sort: filters.sort,
            });

            if (filters.search) queryParams.append("search", filters.search);
            if (filters.country) queryParams.append("country", filters.country);

            const response = await fetch(`${apiUrl}/universities?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Assuming your backend returns { universities: [], totalPages: X }
            // If it just returns an array, adjust this to setUniversities(data) and setTotalPages(1)
            setUniversities(data.universities || data);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error(err);
            setError("Failed to load universities. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [filters.page, filters.sort, filters.search, filters.country]);

    // Re-fetch when page, sort, or direct selects change
    useEffect(() => {
        fetchUniversities();
    }, [filters.page, filters.sort, filters.country, fetchUniversities]);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">Browse Universities</h1>
                    <p className="text-slate-500 mt-2 text-lg">Explore top universities worldwide offering fully funded scholarships.</p>
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
                                placeholder="Search by university name..."
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                            />
                        </form>

                        {/* Dropdown Filters */}
                        <div className="flex flex-wrap w-full md:w-auto gap-3 flex-1 md:justify-end">
                            
                            {/* Example Country Filter */}
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
                                <option value="universityName">Name: A-Z</option>
                                <option value="-universityName">Name: Z-A</option>
                                <option value="-totalScholarships">Most Scholarships</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button onClick={fetchUniversities} className="mt-4 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Loading State (Skeleton) */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-pulse flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0"></div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <div className="h-8 bg-slate-200 rounded-full w-28"></div>
                                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && universities.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900">No universities found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                        <button 
                            onClick={() => setFilters({ search: "", country: "", sort: "universityName", page: 1 })}
                            className="mt-6 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Data Grid */}
                {!isLoading && !error && universities.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {universities.map((uni) => (
                            <div key={uni._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-lg transition-shadow duration-300 group">
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <Landmark className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight mb-1" title={uni.universityName}>
                                            {uni.universityName}
                                        </h2>
                                        <div className="flex items-center text-slate-500 text-sm">
                                            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                                            <span className="truncate">
                                                {uni.city ? `${uni.city}, ` : ''}{uni.country}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-full text-sm">
                                        <GraduationCap className="w-4 h-4 mr-1.5" />
                                        {uni.totalScholarships} {uni.totalScholarships === 1 ? 'Scholarship' : 'Scholarships'}
                                    </div>
                                    
                                    <Link 
                                        href={`/universities/${encodeURIComponent(uni.universityName)}`}
                                        className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center"
                                    >
                                        View 
                                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
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
                            className="p-2 border rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                            ? "bg-blue-600 text-white border-blue-600" 
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
                            className="p-2 border rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}