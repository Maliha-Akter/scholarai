"use client";

import React from 'react';
import { 
  Bot, 
  Globe, 
  Filter, 
  Bookmark, 
  ClipboardCheck, 
  Star,
  Check
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  points: string[];
  Icon: React.ComponentType<{ className?: string }>;
}

const featuresData: FeatureCardProps[] = [
  {
    title: "AI Scholarship Advisor",
    points: [
      "Personalized matching",
      "Country based search",
      "Funding comparison",
      "Smart suggestions"
    ],
    Icon: Bot
  },
  {
    title: "Global Search",
    points: [
      "Worldwide universities",
      "Verified opportunities",
      "Direct portal links",
      "Regularly updated"
    ],
    Icon: Globe
  },
  {
    title: "Advanced Filtering",
    points: [
      "Filter by degree level",
      "Sort by deadlines",
      "Subject-specific tags",
      "Funding type sorting"
    ],
    Icon: Filter
  },
  {
    title: "Save Favorites",
    points: [
      "Bookmark scholarships",
      "Personalized dashboard",
      "Quick access list",
      "Custom notes & tags"
    ],
    Icon: Bookmark
  },
  {
    title: "Application Tracker",
    points: [
      "Monitor deadlines",
      "Track submission status",
      "Document checklists",
      "Progress analytics"
    ],
    Icon: ClipboardCheck
  },
  {
    title: "Student Reviews",
    points: [
      "Real applicant advice",
      "University ratings",
      "Interview experiences",
      "Community feedback"
    ],
    Icon: Star
  }
];

export default function ScholarAIFeatures() {
  return (
    <section className="bg-slate-50/70 py-20 px-4 container mx-auto rounded-3xl my-12 border border-slate-100 shadow-sm">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
          Platform Capabilities
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Why Choose ScholarAI
        </h2>
        <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Everything you need to discover, organize, and successfully apply to global university scholarships—powered by intelligent AI matching.
        </p>
      </div>

      {/* 3D Flip Card Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresData.map((feature, idx) => {
          const IconComponent = feature.Icon;
          return (
            <div 
              key={idx} 
              className="group h-72 [perspective:1000px] w-full"
            >
              {/* Card Inner Wrapper handling the 3D rotation */}
              <div className="relative w-full h-full duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-sm group-hover:shadow-2xl rounded-2xl transition-all">
                
                {/* FRONT FACE (Minimalist & Clean) */}
                <div className="absolute inset-0 w-full h-full bg-white border border-blue-500/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-5 [backface-visibility:hidden] text-center shadow-sm">
                  
                  {/* Subtle top amber highlight bar */}
                  <div className="absolute top-0 w-16 h-1 bg-amber-500 rounded-b-full opacity-80 group-hover:w-24 transition-all duration-300" />

                  <div className="p-5 bg-blue-50/80 text-blue-600 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-inner">
                    <IconComponent className="w-10 h-10 stroke-[1.75]" />
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {feature.title}
                  </h3>
                  
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                    Hover to discover →
                  </span>
                </div>

                {/* BACK FACE (Dark Slate + Bullet Points) */}
                <div className="absolute inset-0 w-full h-full bg-slate-900 text-white border border-slate-800 rounded-2xl p-7 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl">
                  
                  {/* Decorative structural top blue indicator */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
                  
                  <h3 className="text-base font-bold text-amber-400 tracking-tight mb-4 text-center border-b border-slate-800 pb-2">
                    {feature.title}
                  </h3>
                  
                  {/* Bulleted Checkmark List */}
                  <ul className="space-y-2.5 text-left px-2">
                    {feature.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-center gap-2.5 text-sm font-medium text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}