"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  User, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  MessageCircle, 
  ShieldQuestion 
} from "lucide-react";

interface HelpArticle {
  title: string;
  category: string;
  readTime: string;
}

const popularArticles: HelpArticle[] = [
  { title: "How to filter scholarships by fully-funded opportunities", category: "Scholarship Search", readTime: "2 min read" },
  { title: "Understanding how the AI Scholarship Advisor ranks matches", category: "AI Advisor", readTime: "3 min read" },
  { title: "How to save scholarships and export your application list", category: "Application Tracking", readTime: "2 min read" },
  { title: "Updating your academic profile for better AI accuracy", category: "Account Management", readTime: "3 min read" },
  { title: "What to do if you notice an expired scholarship deadline", category: "Platform Guidelines", readTime: "1 min read" },
  { title: "How to submit a review for a scholarship program", category: "Community Reviews", readTime: "2 min read" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#1D4ED8] selection:text-white pb-20">
      
      {/* HERO SECTION WITH SEARCH */}
      <section className="bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-900 text-white pt-20 pb-20 px-4 text-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#1D4ED8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FBBF24] text-xs font-black uppercase tracking-widest border border-white/10">
            <HelpCircle size={16} />
            <span>Help Center & Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            How Can We <span className="text-[#FBBF24]">Help You Today?</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Search our knowledge base for guides on scholarship discovery, AI tools, application tracking, and account security.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search for articles, features, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-[#0F172A] placeholder:text-slate-400 font-medium text-sm sm:text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/40 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Category 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center mb-4 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <BookOpen size={24} />
            </div>
            <h3 className="font-black text-lg text-[#0F172A] mb-1">Scholarship Search</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Learn how to use filters, search criteria, and deadlines effectively.
            </p>
          </div>

          {/* Category 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-4 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
              <Sparkles size={24} />
            </div>
            <h3 className="font-black text-lg text-[#0F172A] mb-1">AI Advisor</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand how our AI matches your profile to global funding options.
            </p>
          </div>

          {/* Category 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24]/20 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-[#FBBF24] group-hover:text-[#0F172A] transition-colors">
              <FileText size={24} />
            </div>
            <h3 className="font-black text-lg text-[#0F172A] mb-1">Applications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track your statuses, organize saved items, and manage submissions.
            </p>
          </div>

          {/* Category 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center mb-4 group-hover:bg-[#1D4ED8] group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <h3 className="font-black text-lg text-[#0F172A] mb-1">Account & Privacy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manage authentication, profile data, and privacy settings.
            </p>
          </div>

        </div>
      </section>

      {/* POPULAR ARTICLES LIST */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              {searchQuery ? "Search Results" : "Frequently Read Guides"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Step-by-step instructions for getting the most out of ScholarAI.
            </p>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-[#1D4ED8] hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="space-y-3">
            {filteredArticles.map((article, idx) => (
              <div 
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#7C3AED]/40 hover:shadow-md transition-all flex items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#F8FAFC] rounded-xl text-[#7C3AED] shrink-0 mt-0.5 group-hover:bg-[#7C3AED]/10 transition-colors">
                    <ShieldQuestion className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mt-1.5 group-hover:text-[#7C3AED] transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-xs text-slate-400 mt-1 inline-block">{article.readTime}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-8">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#0F172A]">No Guides Found</h3>
            <p className="text-sm text-slate-500 mt-1">We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;.</p>
          </div>
        )}
      </section>

      {/* BOTTOM SUPPORT CTA BANNER */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-[#1D4ED8] via-[#7C3AED] to-[#1D4ED8] bg-size-200 animate-gradient text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-lg">
            <span className="text-xs font-black uppercase tracking-widest text-[#FBBF24] bg-black/20 px-3 py-1 rounded-full">
              Still Need Help?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Can&apos;t Find What You&apos;re Looking For?</h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Our support team is happy to assist with your scholarship search, AI recommendations, or university project evaluations.
            </p>
          </div>
          <Link href="/contact" className="shrink-0 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-4 bg-[#FBBF24] hover:bg-[#FBBF24]/90 text-[#0F172A] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}