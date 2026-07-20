"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileText, History, Loader2, MapPin, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

interface Application {
  _id: string;
  status: "Applied" | "Pending" | "Accepted" | "Rejected";
  appliedAt: string;
  scholarship: {
    title: string;
    universityName: string;
    country: string;
  };
}

export default function ApplicationHistoryPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      const response = await fetch(`${apiUrl}/applications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to load history");
      
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      toast.error("Could not load application history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Helper for Status Styling
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (isLoading) return (
    <div className="flex justify-center p-12 md:p-20">
      <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-[#7C3AED]" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10 px-4 sm:px-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
        <div className="inline-flex w-fit p-2.5 md:p-3 bg-[#7C3AED]/10 rounded-xl md:rounded-2xl text-[#7C3AED]">
          <History className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#0F172A]">Application History</h1>
      </div>

      {applications.length === 0 ? (
        
        /* Empty State */
        <div className="text-center py-16 md:py-20 px-4 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
          <FileText className="mx-auto mb-3 md:mb-4 text-slate-300 w-10 h-10 md:w-12 md:h-12" />
          <h3 className="font-bold text-base md:text-lg text-[#0F172A]">No Applications Yet</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">Start exploring scholarships to begin your journey.</p>
        </div>
        
      ) : (
        
        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* =========================================
              MOBILE VIEW (Renders as stacked cards) 
              ========================================= */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {applications.map((app) => (
              <div key={app._id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50 transition-colors">
                
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-bold text-[#1D4ED8] text-base leading-tight">
                    {app.scholarship.title}
                  </h3>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusClasses(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{app.scholarship.universityName}, {app.scholarship.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* =========================================
              DESKTOP VIEW (Renders as standard table) 
              ========================================= */}
          <table className="hidden lg:table w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Scholarship</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">University</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Applied On</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-[#1D4ED8] group-hover:text-blue-700">
                    {app.scholarship.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="font-medium text-slate-900">{app.scholarship.universityName}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{app.scholarship.country}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusClasses(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}