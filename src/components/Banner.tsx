"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Globe, Search, Sparkles, ArrowRight, ChevronDown } from "lucide-react";

export default function Banner() {
    return (
        <section className="relative w-full h-[70vh] min-h-[550px] max-h-[800px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white border-b border-blue-50/50">
            
            {/* Background decorative blurs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full py-12 lg:py-0">
                    
                    {/* Left Column: Text & CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left z-10"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1D4ED8] text-sm font-semibold mb-6 cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>AI-Powered Matching Engine</span>
                        </motion.div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] leading-[1.1] mb-6 tracking-tight">
                            Find Your Dream <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED]">
                                Scholarship
                            </span> with AI
                        </h1>
                        
                        <p className="text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
                            Search <strong className="text-[#0F172A]">20,000+ Scholarships Worldwide</strong>. Let our intelligent assistant match you with the perfect funding opportunities for your academic journey.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link 
                                href="/scholarships"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white font-bold bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                            >
                                <Search className="w-5 h-5" />
                                Find Scholarships
                            </Link>
                            
                            <Link 
                                href="/ai-assistant"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[#0F172A] font-bold bg-white border-2 border-slate-200 hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-slate-50 active:scale-[0.98] transition-all group"
                            >
                                Try AI Assistant
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Column: Animations & Visuals */}
                    <div className="relative w-full h-[300px] sm:h-[400px] flex items-center justify-center lg:justify-end z-10 pointer-events-none">
                        
                        {/* 1. Globe Animation (Center Background) */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute text-slate-200/60"
                        >
                            <Globe className="w-72 h-72 sm:w-96 sm:h-96" strokeWidth={0.75} />
                        </motion.div>

                        {/* 2. Floating Search Animation (Bottom Left overlay) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
                            transition={{ 
                                opacity: { duration: 0.8, delay: 0.2 },
                                x: { duration: 0.8, delay: 0.2 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
                            }}
                            className="absolute bottom-4 left-0 sm:left-10 lg:-left-4 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 w-64 backdrop-blur-sm"
                        >
                            <div className="bg-blue-50 p-2.5 rounded-xl text-[#1D4ED8]">
                                <Search className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#7C3AED]/40 to-transparent"
                                    />
                                </div>
                                <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                            </div>
                        </motion.div>

                        {/* 3. Floating Graduation Cap (Top Right) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, y: [0, 15, 0], rotate: [0, 5, -5, 0] }}
                            transition={{ 
                                opacity: { duration: 0.8, delay: 0.4 },
                                scale: { duration: 0.8, delay: 0.4 },
                                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="absolute top-4 right-4 sm:right-12 bg-gradient-to-br from-[#FBBF24] to-orange-400 p-5 rounded-[2rem] shadow-2xl shadow-orange-500/20 border border-white/20"
                        >
                            <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={1.5} />
                        </motion.div>
                        
                        {/* Decorative Floating Dots */}
                        <motion.div animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#7C3AED] rounded-full" />
                        <motion.div animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-[#1D4ED8] rounded-full" />
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-16 left-1/2 w-2 h-2 bg-[#FBBF24] rounded-full" />
                    </div>
                </div>
            </div>

            {/* Visual Flow Indicator -> Guides the user's eye to the next section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ 
                    opacity: { duration: 1, delay: 1.5 },
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 pointer-events-none"
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Scroll</span>
                <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
        </section>
    );
}