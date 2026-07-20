"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    GraduationCap, Globe, Search, Sparkles, ArrowRight, ChevronDown, 
    Map, Award, BookOpen, Rocket, Target, Star, Users, Briefcase
} from "lucide-react";

const TYPING_WORDS = [
    "Scholarship",
    "University Match",
    "Global Funding",
    "Master's Degree"
];

const SLIDES = [
    {
        id: 1,
        badgeIcon: Sparkles,
        badgeText: "AI-Powered Matching Engine",
        titlePrefix: "Find Your Dream",
        useTyping: true,
        titleHighlight: "", 
        titleSuffix: " with AI",
        description: "Search 20,000+ Scholarships Worldwide. Let our intelligent assistant match you with the perfect funding opportunities for your academic journey.",
        primaryCTA: "Find Scholarships",
        secondaryCTA: "Try AI Assistant",
        reverse: false,
        visualType: "globe"
    },
    {
        id: 2,
        badgeIcon: Map,
        badgeText: "Global Reach",
        titlePrefix: "Unlock",
        useTyping: false,
        titleHighlight: "Global Opportunities",
        titleSuffix: " Today",
        description: "Explore fully-funded and partial scholarships across top universities in the US, UK, Canada, Australia, and Europe with a single click.",
        primaryCTA: "Explore Countries",
        secondaryCTA: "24/7 Support",
        reverse: true, // Text Right, Visual Left
        visualType: "map"
    },
    {
        id: 3,
        badgeIcon: Rocket,
        badgeText: "Fast-Track Your Career",
        titlePrefix: "Secure",
        useTyping: false,
        titleHighlight: "Fully Funded",
        titleSuffix: " Programs",
        description: "Don't let finances hold you back. Discover programs that cover tuition, housing, and living stipends to accelerate your career.",
        primaryCTA: "View Funded Programs",
        secondaryCTA: "Find Guidelines",
        reverse: false, 
        visualType: "rocket"
    },
    {
        id: 4,
        badgeIcon: Users,
        badgeText: "Community of Scholars",
        titlePrefix: "Join",
        useTyping: false,
        titleHighlight: "10,000+ Scholars",
        titleSuffix: " Worldwide",
        description: "Connect with successful applicants, access premium mentorship, and get step-by-step guidance on your university applications.",
        primaryCTA: "Join Community",
        secondaryCTA: "Find a Mentor",
        reverse: true, // Text Right, Visual Left
        visualType: "users"
    }
];

// ✅ MOVED OUTSIDE: Prevents React from resetting component state on render
const SlideVisuals = ({ type }: { type: string }) => {
    switch (type) {
        case "map":
            return (
                <>
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute text-slate-200/60">
                        <Map className="w-72 h-72 sm:w-96 sm:h-96" strokeWidth={0.75} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 right-0 sm:right-10 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 w-60 backdrop-blur-sm"
                    >
                        <div className="bg-purple-50 p-2.5 rounded-xl text-[#7C3AED]"><Award className="w-6 h-6" /></div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-2 w-full bg-slate-100 rounded-full" />
                            <div className="h-2 w-2/3 bg-[#7C3AED]/40 rounded-full" />
                        </div>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 15, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 left-4 sm:left-12 bg-gradient-to-br from-[#1D4ED8] to-blue-400 p-4 rounded-3xl shadow-2xl shadow-blue-500/20 border border-white/20"
                    >
                        <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
                    </motion.div>
                </>
            );
        case "rocket":
            return (
                <>
                    <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute text-slate-200/60">
                        <Target className="w-72 h-72 sm:w-96 sm:h-96" strokeWidth={0.75} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-4 left-0 sm:left-10 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 w-56 backdrop-blur-sm"
                    >
                        <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500"><Star className="w-6 h-6" /></div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
                            <div className="h-2 w-1/2 bg-orange-300 rounded-full" />
                        </div>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-8 right-4 sm:right-16 bg-gradient-to-br from-[#7C3AED] to-purple-400 p-5 rounded-full shadow-2xl shadow-purple-500/20 border border-white/20"
                    >
                        <Rocket className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={1.5} />
                    </motion.div>
                </>
            );
        case "users":
            return (
                <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute text-slate-200/60">
                        <Users className="w-72 h-72 sm:w-96 sm:h-96" strokeWidth={0.75} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-10 right-0 sm:right-4 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 w-64 backdrop-blur-sm"
                    >
                        <div className="bg-green-50 p-2.5 rounded-xl text-green-600"><Briefcase className="w-6 h-6" /></div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-2 w-full bg-slate-100 rounded-full" />
                            <div className="h-2 w-4/5 bg-green-400/50 rounded-full" />
                        </div>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-12 left-4 sm:left-10 bg-gradient-to-br from-[#10B981] to-emerald-400 p-4 rounded-[2rem] shadow-2xl shadow-emerald-500/20 border border-white/20"
                    >
                        <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
                    </motion.div>
                </>
            );
        default: // "globe"
            return (
                <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute text-slate-200/60">
                        <Globe className="w-72 h-72 sm:w-96 sm:h-96" strokeWidth={0.75} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-4 left-0 sm:left-10 lg:-left-4 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 w-64 backdrop-blur-sm"
                    >
                        <div className="bg-blue-50 p-2.5 rounded-xl text-[#1D4ED8]"><Search className="w-6 h-6" /></div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#7C3AED]/40 to-transparent" />
                            </div>
                            <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                        </div>
                    </motion.div>
                    <motion.div
                        animate={{ scale: 1, y: [0, 15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-4 right-4 sm:right-12 bg-gradient-to-br from-[#FBBF24] to-orange-400 p-5 rounded-[2rem] shadow-2xl shadow-orange-500/20 border border-white/20"
                    >
                        <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={1.5} />
                    </motion.div>
                </>
            );
    }
};

export default function Banner() {
    // Typing Animation State
    const [wordIndex, setWordIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Slider State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Typing Effect Logic (Only runs for Slide 1)
    useEffect(() => {
        if (currentSlide !== 0) return; // Pause typing if not on first slide
        
        const currentWord = TYPING_WORDS[wordIndex];
        const timer = setTimeout(() => {
            if (!isDeleting) {
                setText(currentWord.substring(0, text.length + 1));
                if (text.length + 1 === currentWord.length) {
                    setTimeout(() => setIsDeleting(true), 1500);
                }
            } else {
                setText(currentWord.substring(0, text.length - 1));
                if (text.length - 1 === 0) {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
                }
            }
        }, isDeleting ? 40 : 90);

        return () => clearTimeout(timer);
    }, [text, isDeleting, wordIndex, currentSlide]);

    // Auto-play Slider Logic
    useEffect(() => {
        if (isPaused) return;
        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000); // Change slide every 6 seconds
        return () => clearInterval(slideTimer);
    }, [isPaused]);

    return (
        <section 
            className="relative container mx-auto flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white border-b border-blue-50/50 pt-16 pb-24 lg:py-0 mb-0 lg:mb-10 min-h-[650px] h-auto lg:h-[65vh] lg:max-h-[750px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background decorative blurs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1D4ED8]/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full relative flex flex-col justify-center">
                
                {/* Slider Container */}
                <div className="relative w-full flex-grow flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"
                        >
                            {/* Text Column */}
                            <div className={`flex flex-col items-center lg:items-start text-center lg:text-left z-10 order-1 ${SLIDES[currentSlide].reverse ? 'lg:order-2' : 'lg:order-1'}`}>
                                
                                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1D4ED8] text-sm font-semibold mb-6 cursor-pointer">
                                    {React.createElement(SLIDES[currentSlide].badgeIcon, { className: "w-4 h-4" })}
                                    <span>{SLIDES[currentSlide].badgeText}</span>
                                </motion.div>
                                
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] leading-[1.15] mb-6 tracking-tight min-h-[130px] sm:min-h-[160px] lg:min-h-[190px]">
                                    {SLIDES[currentSlide].titlePrefix} <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED]">
                                        {SLIDES[currentSlide].useTyping ? text : SLIDES[currentSlide].titleHighlight}
                                    </span>
                                    {SLIDES[currentSlide].useTyping && (
                                        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block text-[#7C3AED] font-light ml-1">
                                            |
                                        </motion.span> 
                                    )}
                                    <span className="block sm:inline">{SLIDES[currentSlide].titleSuffix}</span>
                                </h1>
                                
                                <p className="text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
                                    {SLIDES[currentSlide].description}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                    <Link href="/scholarships/view" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white font-bold bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                                        <Search className="w-5 h-5" />
                                        {SLIDES[currentSlide].primaryCTA}
                                    </Link>
                                    <Link href="/ai-assistant" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[#0F172A] font-bold bg-white border-2 border-slate-200 hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-slate-50 active:scale-[0.98] transition-all group">
                                        {SLIDES[currentSlide].secondaryCTA}
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </div>
                            </div>

                            {/* Visuals Column */}
                            <div className={`relative w-full h-[300px] sm:h-[400px] flex items-center z-10 pointer-events-none order-2 ${SLIDES[currentSlide].reverse ? 'justify-center lg:justify-start lg:order-1' : 'justify-center lg:justify-end lg:order-2'}`}>
                                <SlideVisuals type={SLIDES[currentSlide].visualType} />
                                
                                {/* Background Decorative Dots */}
                                <motion.div animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className={`absolute top-1/3 ${SLIDES[currentSlide].reverse ? 'right-1/4' : 'left-1/4'} w-3 h-3 bg-[#7C3AED] rounded-full`} />
                                <motion.div animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className={`absolute bottom-1/4 ${SLIDES[currentSlide].reverse ? 'left-1/4' : 'right-1/4'} w-4 h-4 bg-[#1D4ED8] rounded-full`} />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ✅ FIXED GAP & OVERLAP: Adjusted spacing and bottom positioning */}
                <div className="absolute bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                    {SLIDES.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                currentSlide === index 
                                ? "w-8 h-2.5 bg-[#1D4ED8]" 
                                : "w-2.5 h-2.5 bg-slate-300 hover:bg-[#7C3AED]"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Visual Flow Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ opacity: { duration: 1, delay: 1.5 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                className="absolute bottom-2 lg:bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 pointer-events-none hidden sm:flex"
            >
                <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
        </section>
    );
}