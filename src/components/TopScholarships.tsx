"use client";

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Star,
  Banknote
} from "lucide-react";
import Link from 'next/link';

interface Scholarship {
  _id: string;
  slug?: string;
  image?: string;
  title: string;
  universityName: string;
  country: string;
  degree: string;
  fundingType: string;
  applicationDeadline?: string;
  rating?: number;
  isFeatured?: boolean;
}

export default function TopScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchTopScholarships = async () => {
      try {
        setIsLoading(true);
        // Calls the dedicated public random scholarships endpoint
        const res = await fetch(`${baseUrl}/api/scholarships/random`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setScholarships(data.data);
        }
      } catch (err) {
        console.error("Error fetching top scholarships:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopScholarships();
  }, [baseUrl]);

  // Helper to format deadline dates cleanly
  const formatDeadline = (dateString?: string) => {
    if (!dateString) return "Ongoing";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ongoing";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="space-y-6 container mx-auto px-4 py-12 my-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Featured Opportunities
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2.5">
            Top Global Scholarships
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Hand-picked funded programs from top-ranking universities worldwide.
          </p>
        </div>
        
        <Link
          href="/scholarships"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap group"
        >
          Browse All Scholarships
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[400px] rounded-2xl bg-white border border-slate-200/80 p-4 flex flex-col justify-between space-y-3 animate-pulse shadow-sm"
            >
              <div className="w-full h-44 bg-slate-200 rounded-xl" />
              <div className="space-y-3 px-2 flex-1 pt-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="pt-4 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No scholarships currently featured</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            We are updating our database with new funded opportunities. Please check back shortly!
          </p>
          <Link
            href="/scholarships"
            className="mt-6 inline-block text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4"
          >
            Search all available programs &rarr;
          </Link>
        </div>
      ) : (
        /* Render 3 Scholarships Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scholarships.map((item) => {
            const isExpired = item.applicationDeadline 
              ? new Date(item.applicationDeadline) < new Date() 
              : false;

            return (
              <div 
                key={item._id} 
                className="group bg-white border border-slate-200/80 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden"
              >
                {/* Image Banner & Badges */}
                <div className="w-full h-48 relative bg-slate-100 overflow-hidden shrink-0 border-b border-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                      <GraduationCap size={48} className="text-blue-400 opacity-60" />
                    </div>
                  )}

                  {/* Top Right Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-extrabold text-slate-800 shadow-sm flex items-center gap-1 border border-slate-200/50">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{item.rating && item.rating > 0 ? item.rating.toFixed(1) : "New"}</span>
                  </div>

                  {/* Top Left Featured/Funding Tag */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.isFeatured && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  
                  <div>
                    {/* Degree & Funding Type Pills */}
                    <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                      <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-100/60">
                        {item.degree || "Any Degree"}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-100/60 flex items-center gap-1">
                        <Banknote className="w-3 h-3" />
                        {item.fundingType || "Funded"}
                      </span>
                    </div>

                    {/* Title & University */}
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1 line-clamp-1">
                      {item.universityName || "Global Institution"}
                    </p>
                  </div>

                  {/* Metadata Footer: Location & Deadline */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center text-xs text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                      <span className="truncate">{item.country || "International"}</span>
                    </div>

                    <div className="flex items-center text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                      <span className={isExpired ? "text-red-500 font-bold" : "text-slate-600"}>
                        Deadline: {formatDeadline(item.applicationDeadline)}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link
                        href={`/scholarships/${item._id}`}
                        className="w-full block py-2.5 px-4 bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white rounded-xl text-xs font-bold transition-all text-center border border-slate-200/80 group-hover:border-blue-600 shadow-2xs"
                      >
                        View Scholarship Details
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}