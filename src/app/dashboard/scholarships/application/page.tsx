"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FileText, History, Loader2 } from "lucide-react";
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
    <div className="flex justify-center p-20">
      <Loader2 className="w-10 h-10 animate-spin text-[#7C3AED]" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#7C3AED]/10 rounded-2xl text-[#7C3AED]">
          <History size={28} />
        </div>
        <h1 className="text-3xl font-black text-[#0F172A]">Application History</h1>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <FileText className="mx-auto mb-4 text-slate-300" size={48} />
          <h3 className="font-bold text-lg text-[#0F172A]">No Applications Yet</h3>
          <p className="text-slate-500">Start exploring scholarships to begin your journey.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">SCHOLARSHIP</th>
                <th className="px-6 py-4 font-semibold text-slate-600">UNIVERSITY</th>
                <th className="px-6 py-4 font-semibold text-slate-600">APPLIED ON</th>
                <th className="px-6 py-4 font-semibold text-slate-600">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1D4ED8]">{app.scholarship.title}</td>
                  <td className="px-6 py-4 text-slate-600">{app.scholarship.universityName}, {app.scholarship.country}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusClasses(app.status)}`}>
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