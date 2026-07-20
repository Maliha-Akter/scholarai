"use client";

import React from 'react';
import { 
  Search, 
  Bot, 
  Bookmark, 
  FileText, 
  Star, 
  BarChart3, 
  ArrowRight 
} from "lucide-react";
import Link from 'next/link';

interface ServiceItem {
  title: string;
  description: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const servicesData: ServiceItem[] = [
  {
    title: "Scholarship Search",
    description: "Find scholarships using advanced filters like country, degree, subject, and funding type.",
    link: "/scholarships",
    icon: Search,
    iconBg: "bg-blue-50 group-hover:bg-blue-600",
    iconColor: "text-blue-600 group-hover:text-white"
  },
  {
    title: "AI Scholarship Advisor",
    description: "Receive personalized recommendations based on your academic profile.",
    link: "/smart-recommendation",
    icon: Bot,
    iconBg: "bg-indigo-50 group-hover:bg-indigo-600",
    iconColor: "text-indigo-600 group-hover:text-white"
  },
  {
    title: "Save Scholarships",
    description: "Bookmark scholarships to review later and build your personal shortlist.",
    link: "/dashboard/saved-scholarships",
    icon: Bookmark,
    iconBg: "bg-amber-50 group-hover:bg-amber-600",
    iconColor: "text-amber-600 group-hover:text-white"
  },
  {
    title: "Application Tracker",
    description: "Track every scholarship you've applied for in one organized dashboard.",
    link: "/dashboard/my-applications",
    icon: FileText,
    iconBg: "bg-emerald-50 group-hover:bg-emerald-600",
    iconColor: "text-emerald-600 group-hover:text-white"
  },
  {
    title: "Reviews & Ratings",
    description: "Read experiences from other students and share your own reviews after applying.",
    link: "/scholarships",
    icon: Star,
    iconBg: "bg-rose-50 group-hover:bg-rose-600",
    iconColor: "text-rose-600 group-hover:text-white"
  },
  {
    title: "Personal Dashboard",
    description: "View your saved scholarships, applications, and personalized statistics in one place.",
    link: "/dashboard",
    icon: BarChart3,
    iconBg: "bg-purple-50 group-hover:bg-purple-600",
    iconColor: "text-purple-600 group-hover:text-white"
  }
];

export default function OurServices() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-3">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
          Our Services
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          What We Offer
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Everything you need to discover, organize, and apply for scholarships with confidence.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {servicesData.map((service, idx) => {
          const IconComponent = service.icon;
          return (
            <div 
              key={idx}
              className="group bg-white border border-slate-200/80 hover:border-blue-500/50 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6"
            >
              {/* Left Side: Icon & Content */}
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-xl ${service.iconBg} ${service.iconColor} transition-all duration-300 shrink-0 shadow-inner`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Right Side: Learn More Action Link */}
              <div className="shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex justify-center sm:block">
                <Link
                  href={service.link}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors whitespace-nowrap bg-slate-50 group-hover:bg-blue-50 w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl border border-slate-200/60 group-hover:border-blue-100"
                >
                  <span>Learn More</span>
                  <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}