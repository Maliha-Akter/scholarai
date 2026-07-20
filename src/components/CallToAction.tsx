"use client";

import React from 'react';
import Link from 'next/link';
import { Rocket, Bot, Sparkles, Globe, GraduationCap } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="container mx-auto px-4 my-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 md:p-16 text-white shadow-xl">
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Start Your Academic Journey</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to Find Your Dream Scholarship?
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-blue-100/90 font-medium leading-relaxed max-w-2xl mx-auto">
            Explore hundreds of scholarship opportunities, receive personalized AI recommendations, and keep track of your applications—all in one platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            {/* Primary CTA: Explore Scholarships */}
            <Link
              href="/scholarships/view"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blue-700 hover:bg-slate-100 rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Rocket className="w-4 h-4 text-blue-600" />
              <span>Explore Scholarships</span>
            </Link>

            {/* Secondary CTA: Try AI Advisor */}
            <Link
              href="/ai-recommender"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-900/40 hover:bg-blue-900/60 text-white rounded-2xl font-extrabold text-sm border border-white/20 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Try AI Advisor</span>
            </Link>

          </div>

          {/* Micro Footer Features */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-blue-200">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-300" /> 100% Free for Students
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-300" /> Global University Database
            </span>
            <span className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-purple-300" /> Powered by Llama AI
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}