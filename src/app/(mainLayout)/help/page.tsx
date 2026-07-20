"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Sparkles, 
  User, 
  FileText, 
  HelpCircle, 
  MessageCircle, 
  ShieldQuestion,
  ChevronDown 
} from "lucide-react";

interface HelpArticle {
  title: string;
  category: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const popularArticles: HelpArticle[] = [
  { title: "How to filter scholarships by fully-funded opportunities", category: "Scholarship Search" },
  { title: "Understanding how the AI Scholarship Advisor ranks matches", category: "AI Advisor" },
  { title: "How to save scholarships and export your application list", category: "Application Tracking" },
  { title: "Updating your academic profile for better AI accuracy", category: "Account Management" },
  { title: "What to do if you notice an expired scholarship deadline", category: "Platform Guidelines" },
  { title: "How to submit a review for a scholarship program", category: "Community Reviews" },
];

const faqsData: FAQItem[] = [
  {
    question: "How do I find scholarships?",
    answer: "Use the search and filter options to browse scholarships by country, degree level, subject, funding type, and application deadline."
  },
  {
    question: "How does the AI Scholarship Advisor work?",
    answer: "The AI Scholarship Advisor analyzes your selected preferences—such as country, degree, subject, and funding type—and recommends scholarships that best match your criteria."
  },
  {
    question: "Can I save scholarships for later?",
    answer: "Yes. Click the Save button on any scholarship to bookmark it. You can access all your saved scholarships from your dashboard."
  },
  {
    question: "How can I track my applications?",
    answer: "After applying for a scholarship, click Apply Now to record your application. Your application history is available in your dashboard."
  },
  {
    question: "Are all scholarships fully funded?",
    answer: "No. The platform includes fully funded, partially funded, and self-funded scholarships. You can filter scholarships based on the funding type you prefer."
  },
  {
    question: "Can I submit reviews for scholarships?",
    answer: "Yes. Students can rate scholarships and share their experiences. Each user can submit one review per scholarship."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes. Your account, saved scholarships, applications, and personal data are protected through secure authentication and are only accessible to you."
  },
  {
    question: "Is ScholarAI free to use?",
    answer: "Yes. You can search scholarships, receive AI recommendations, save opportunities, and track applications without any subscription fee."
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#1D4ED8] selection:text-white pb-20">
      
      {/* HERO SECTION */}
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
            Browse our knowledge base for guides on scholarship discovery, AI tools, application tracking, and account security.
          </p>
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

      {/* KEY PLATFORM TOPICS LIST (Simplified without arrows or read times) */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Key Platform Topics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Core features and functionalities available to assist your academic journey.
          </p>
        </div>

        <div className="space-y-3">
          {popularArticles.map((article, idx) => (
            <div 
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4"
            >
              <div className="p-2.5 bg-[#F8FAFC] rounded-xl text-[#7C3AED] shrink-0">
                <ShieldQuestion className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {article.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mt-1.5">
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 px-4 max-w-4xl mx-auto mb-12 relative bg-[#F8FAFC] rounded-3xl">
        {/* Infinite Midnight Blue, Gold, and Violet Shifting Border Keyframes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes faqBorderFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-faq-border {
            background-size: 200% 200%;
            animation: faqBorderFlow 4s ease infinite;
          }
        `}} />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED] bg-[#7C3AED]/10 px-3.5 py-1.5 rounded-full border border-[#7C3AED]/20">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Everything you need to know about finding opportunities, tracking applications, and using the AI Advisor.
          </p>
        </div>

        {/* Accordion List Container */}
        <div className="space-y-4">
          {faqsData.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <div 
                key={idx}
                className={`relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-gradient-to-r from-[#1D4ED8] via-[#FBBF24] to-[#7C3AED] animate-faq-border shadow-lg shadow-[#7C3AED]/10' 
                    : 'bg-slate-200/80 hover:bg-slate-300 shadow-sm'
                }`}
              >
                {/* Inner Content Block */}
                <div className="bg-white rounded-[14px] overflow-hidden transition-colors duration-300">
                  
                  {/* Accordion Trigger Button */}
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4 focus:outline-none select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`w-5 h-5 shrink-0 transition-colors duration-200 ${isOpen ? 'text-[#7C3AED]' : 'text-slate-400'}`} />
                      <span className="font-bold text-sm sm:text-base text-[#0F172A] tracking-tight">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180 text-[#1D4ED8]' : ''
                      }`} 
                    />
                  </button>

                  {/* Smooth Max-Height Reveal Panel */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 sm:p-6 bg-[#F8FAFC] text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
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