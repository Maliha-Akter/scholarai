"use client";

import React from "react";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  Heart, 
  FileText, 
  Star, 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Target,
  BookOpen,
  Compass
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#1D4ED8] selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-black uppercase tracking-widest border border-[#7C3AED]/20 mb-6">
          <GraduationCap size={16} />
          <span>About ScholarAI</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-tight mb-6">
          Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] via-[#7C3AED] to-[#1D4ED8]">Scholarship Journey</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Empowering students to discover scholarship opportunities with intelligent search, AI-powered recommendations, and an easy-to-use application tracking platform.
        </p>
      </section>

      {/* 2. OUR STORY & 3. OUR MISSION */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Our Story Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D4ED8]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center mb-6">
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-4">Our Story</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-4">
                Finding the right scholarship can be overwhelming due to the large number of opportunities, varying eligibility requirements, and scattered application information. ScholarAI was created to simplify this process by bringing scholarship discovery, personalized recommendations, and application management into one platform.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-medium">
                Whether you&apos;re searching for undergraduate, master&apos;s, or PhD opportunities, ScholarAI helps you find scholarships that match your academic goals.
              </p>
            </div>
          </div>

          {/* Our Mission Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Our mission is to make scholarship discovery simple, accessible, and efficient for students worldwide. We aim to reduce the time spent searching for opportunities while helping students make informed decisions through AI-powered recommendations and organized application tracking.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHAT WE OFFER */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#1D4ED8] bg-[#1D4ED8]/10 px-3.5 py-1.5 rounded-full border border-[#1D4ED8]/20 mb-3 inline-block">
            Comprehensive Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">What We Offer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center mb-5">
              <Search size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <span>🎓</span> Scholarship Search
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Browse scholarships using filters such as country, degree, subject, funding type, and deadline.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-5">
              <Sparkles size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <span>🤖</span> AI Scholarship Advisor
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Receive personalized scholarship recommendations based on your academic preferences.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24]/15 text-[#FBBF24] flex items-center justify-center mb-5">
              <Heart size={22} className="fill-[#FBBF24]" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <span>❤️</span> Save Scholarships
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Bookmark opportunities for future reference so you never lose track of programs you love.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center mb-5">
              <FileText size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <span>📝</span> Application Tracking
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Keep a structured record of all the scholarships you&apos;ve applied for and monitor their statuses.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#FBBF24]/15 text-[#FBBF24] flex items-center justify-center mb-5">
              <Star size={22} className="fill-[#FBBF24]" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <span>⭐</span> Student Reviews
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Read transparent reviews from other applicants and share your own unique application experiences.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-5">
              <LayoutDashboard size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <span>📊</span> Personal Dashboard
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Monitor your saved scholarships, application histories, and AI activities from one unified place.
            </p>
          </div>

        </div>
      </section>

      {/* 5. WHY CHOOSE SCHOLARAI? */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/10 px-3.5 py-1.5 rounded-full border border-[#7C3AED]/20 mb-3 inline-block">
            The Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">Why Choose ScholarAI?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center mb-4">
              <Zap size={26} />
            </div>
            <h3 className="font-bold text-base text-[#0F172A] mb-2">Smart Search</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Find scholarships quickly using advanced filtering options.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-4">
              <Sparkles size={26} />
            </div>
            <h3 className="font-bold text-base text-[#0F172A] mb-2">AI Recommendations</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Receive personalized suggestions tailored to your interests.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8] flex items-center justify-center mb-4">
              <ShieldCheck size={26} />
            </div>
            <h3 className="font-bold text-base text-[#0F172A] mb-2">Secure Platform</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Your saved scholarships and application history remain private and secure.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-4">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="font-bold text-base text-[#0F172A] mb-2">Easy to Use</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              A clean and responsive interface designed specifically for students.
            </p>
          </div>

        </div>
      </section>

      {/* 6. OUR VISION */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-900 text-white p-8 sm:p-14 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#1D4ED8]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#FBBF24] flex items-center justify-center mx-auto border border-white/10">
              <Compass size={26} />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Our Vision
            </h2>
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              &ldquo;We envision a future where every student has equal access to educational opportunities. By combining modern technology with intelligent recommendations, ScholarAI strives to make scholarship discovery more efficient, transparent, and accessible for learners around the world.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION (CTA) */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-12">
        <div className="bg-gradient-to-r from-[#1D4ED8] via-[#7C3AED] to-[#1D4ED8] bg-size-200 animate-gradient text-white p-10 sm:p-16 rounded-3xl shadow-2xl text-center relative overflow-hidden border border-white/10">
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Find Your Perfect Scholarship?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Join ScholarAI today and explore scholarship opportunities, receive AI-powered recommendations, and manage your applications in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/scholarships" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FBBF24] hover:bg-[#FBBF24]/90 text-[#0F172A] font-black text-sm shadow-lg shadow-black/10 transition-all duration-200 flex items-center justify-center gap-2 group">
                  <span>Explore Scholarships</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all duration-200">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}