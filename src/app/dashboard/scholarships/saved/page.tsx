"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, Button, Spinner } from "@heroui/react";
import { 
  Heart, 
  Star, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Building2, 
  Trash2, 
  ExternalLink, 
  BookmarkCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

interface SavedScholarship {
  _id: string;
  savedAt?: string;
  image?: string;
  title: string;
  slug?: string;
  universityName: string;
  country: string;
  degree: string;
  fundingType: string;
  applicationDeadline: string;
  rating?: number;
}

export default function SavedScholarshipsPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [scholarships, setScholarships] = useState<SavedScholarship[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch saved scholarships with Token Authorization
  const fetchSavedScholarships = useCallback(async () => {
    setIsFetching(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      if (!token) {
        throw new Error("Authentication error: You are not logged in.");
      }

      const response = await fetch(`${apiUrl}/saved`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch saved scholarships");
      }

      const data: SavedScholarship[] = await response.json();
      setScholarships(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not load saved scholarships.";
      toast.error(errorMessage);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // FIXED: No synchronous setState inside the effect body
  useEffect(() => {
    if (session?.user) {
      fetchSavedScholarships();
    }
  }, [session?.user, fetchSavedScholarships]);

  // Handle removing a scholarship with Token Authorization
  const handleRemove = async (scholarshipId: string, title: string) => {
    setRemovingId(scholarshipId);
    
    // Optimistic UI update
    const previousList = [...scholarships];
    setScholarships((prev) => prev.filter((item) => item._id !== scholarshipId));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      if (!token) {
        throw new Error("Authentication error: You are not logged in.");
      }

      const response = await fetch(`${apiUrl}/saved/${scholarshipId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove scholarship");
      }

      toast.success(`Removed "${title}" from saved list.`);
    } catch (err: unknown) {
      // Revert optimistic update if API call fails
      setScholarships(previousList);
      const errorMessage = err instanceof Error ? err.message : "Could not remove scholarship.";
      toast.error(errorMessage);
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Rolling / TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Derive global loading state without needing useEffect state setters
  const isLoading = sessionLoading || (Boolean(session?.user) && isFetching && scholarships.length === 0);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 min-h-[70vh] items-center justify-center bg-[#F8FAFC]">
        <Spinner color="accent" size="lg" />
        <span className="text-sm font-medium text-slate-500">Loading your saved scholarships...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto text-center mt-20 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg">
        <AlertCircle className="w-12 h-12 text-[#7C3AED] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Login Required</h2>
        <p className="text-slate-500 text-sm mb-6">Please log in to view and manage your saved scholarships.</p>
        <Link href="/login">
          <Button className="w-full font-bold bg-[#1D4ED8] text-white rounded-xl shadow-md shadow-[#1D4ED8]/20">
            Sign In Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED]">
                <BookmarkCheck size={26} />
              </div>
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
                Saved Scholarships
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1 sm:ml-12">
              Review deadlines, check requirements, and track your favorite opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Total Saved:</span>
            <span className="text-sm font-black text-[#1D4ED8] bg-[#1D4ED8]/10 px-2.5 py-0.5 rounded-full">
              {scholarships.length}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {scholarships.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-xl mx-auto px-6">
            <div className="w-16 h-16 rounded-full bg-[#FBBF24]/15 text-[#FBBF24] flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="fill-[#FBBF24]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Saved Scholarships Yet</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              You haven&apos;t bookmarked any scholarships yet. Explore our database to find programs matching your academic goals!
            </p>
            <Link href="/explore">
              <Button className="font-bold bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] text-white px-8 rounded-xl shadow-lg shadow-[#7C3AED]/20">
                Explore Scholarships
              </Button>
            </Link>
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((item) => (
              <Card 
                key={item._id} 
                className="flex flex-col bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image & Top Badges Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-black/30" />

                  {/* Funding Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#1D4ED8] text-white shadow-md border border-white/10">
                      {item.fundingType || "Scholarship"}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item._id, item.title)}
                    disabled={removingId === item._id}
                    title="Remove from saved"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-rose-500 text-rose-500 hover:text-white backdrop-blur-md shadow-md transition-colors duration-200 disabled:opacity-50"
                  >
                    {removingId === item._id ? (
                      <Spinner size="sm" color="current" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>

                  {/* Rating Badge */}
                  {item.rating && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 text-white text-xs font-bold">
                      <Star size={13} className="fill-[#FBBF24] text-[#FBBF24]" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Degree Badge */}
                  <div className="absolute bottom-3 right-3 bg-[#7C3AED]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <GraduationCap size={13} className="text-[#FBBF24]" />
                    <span>{item.degree || "Degree"}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    {/* Title */}
                    <Link href={`/scholarships/view/${item.slug || item._id}`} className="block group/title">
                      <h3 className="font-bold text-lg text-[#0F172A] group-hover/title:text-[#1D4ED8] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </Link>

                    {/* University & Country Info */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Building2 size={14} className="text-[#7C3AED] shrink-0" />
                        <span className="truncate">{item.universityName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <MapPin size={14} className="text-[#1D4ED8] shrink-0" />
                        <span className="truncate">{item.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                    {/* Deadline */}
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Calendar size={14} className="text-[#FBBF24]" />
                      <span>Deadline: <strong className="text-[#0F172A] font-semibold">{formatDate(item.applicationDeadline)}</strong></span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/dashboard/scholarships/view/${item.slug || item._id}`} className="w-full mt-1">
                    <Button className="w-full font-bold text-xs bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white rounded-xl shadow-md shadow-[#1D4ED8]/15 flex items-center justify-center gap-1.5 py-5 transition-all">
                      <span>View Details</span>
                      <ExternalLink size={14} className="text-[#FBBF24]" />
                    </Button>
                  </Link>
                </div>

              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}