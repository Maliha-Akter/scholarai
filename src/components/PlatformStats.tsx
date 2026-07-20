"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  GraduationCap, 
  Globe, 
  Building2, 
  Banknote, 
  FileCheck, 
  Star 
} from "lucide-react";

// Dynamically import CountUp with SSR disabled to prevent hydration DOM crashes
const CountUp = dynamic(() => import('react-countup'), { ssr: false });

interface StatsData {
  totalScholarships: number;
  countries: number;
  universities: number;
  fullyFunded: number;
  applications: number;
  reviews: number;
}

export default function PlatformStats() {
  const [stats, setStats] = useState<StatsData>({
    totalScholarships: 250,
    countries: 45,
    universities: 110,
    fullyFunded: 180,
    applications: 1240,
    reviews: 530
  });

  const [isLoading, setIsLoading] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. Fetch backend stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/stats`);
        const result = await res.json();

        if (result.success && result.data) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch live platform stats, using defaults:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [baseUrl]);

  // 2. Safe native scroll observer replacing the buggy enableScrollSpy prop
  useEffect(() => {
    const observer = new IntersectionObserver(
      (([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Animate only once
        }
      }),
      { threshold: 0.15 } // Trigger when 15% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const statCards = [
    {
      title: "Scholarships",
      value: stats.totalScholarships,
      icon: GraduationCap,
      suffix: "+",
      color: "text-blue-600",
      bg: "bg-blue-50 group-hover:bg-blue-600",
      border: "hover:border-blue-500/50"
    },
    {
      title: "Countries",
      value: stats.countries,
      icon: Globe,
      suffix: "+",
      color: "text-emerald-600",
      bg: "bg-emerald-50 group-hover:bg-emerald-600",
      border: "hover:border-emerald-500/50"
    },
    {
      title: "Universities",
      value: stats.universities,
      icon: Building2,
      suffix: "+",
      color: "text-purple-600",
      bg: "bg-purple-50 group-hover:bg-purple-600",
      border: "hover:border-purple-500/50"
    },
    {
      title: "Fully Funded",
      value: stats.fullyFunded,
      icon: Banknote,
      suffix: "+",
      color: "text-amber-600",
      bg: "bg-amber-50 group-hover:bg-amber-600",
      border: "hover:border-amber-500/50"
    },
    {
      title: "Applications",
      value: stats.applications,
      icon: FileCheck,
      suffix: "+",
      color: "text-indigo-600",
      bg: "bg-indigo-50 group-hover:bg-indigo-600",
      border: "hover:border-indigo-500/50"
    },
    {
      title: "Student Reviews",
      value: stats.reviews,
      icon: Star,
      suffix: "+",
      color: "text-rose-600",
      bg: "bg-rose-50 group-hover:bg-rose-600",
      border: "hover:border-rose-500/50"
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="bg-slate-50/70 py-16 px-4 container mx-auto rounded-3xl my-12 border border-slate-100 shadow-sm"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
          Real-Time Metrics
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-2">
          Platform Impact
        </h2>
        <p className="text-sm text-slate-500">
          Connecting students worldwide with fully funded academic opportunities and verified university partners.
        </p>
      </div>

      {/* 2x3 Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={idx}
              className={`group bg-white border border-slate-200/80 ${card.border} rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1`}
            >
              {/* Animated Icon Well */}
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:text-white transition-all duration-300 mb-4 shadow-inner scale-100 group-hover:scale-110`}>
                <IconComponent className="w-8 h-8 stroke-[1.75]" />
              </div>

              {/* Crash-Free Number Animation */}
              <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1 flex items-center justify-center min-h-[40px]">
                {isLoading ? (
                  <span className="inline-block w-20 h-9 bg-slate-100 rounded animate-pulse" />
                ) : (
                  <>
                    {inView ? (
                      <CountUp 
                        start={0} 
                        end={card.value} 
                        duration={2.5} 
                        separator="," 
                      />
                    ) : (
                      <span>0</span>
                    )}
                    <span className={card.color}>{card.suffix}</span>
                  </>
                )}
              </div>

              {/* Card Label */}
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover:text-slate-700 transition-colors">
                {card.title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}