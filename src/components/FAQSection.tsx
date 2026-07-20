"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto my-12 relative bg-[#F8FAFC] rounded-3xl">
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
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
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
  );
}