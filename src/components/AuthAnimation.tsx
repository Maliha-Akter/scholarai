"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import React from "react";

export default function AuthAnimation() {
  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative flex-col justify-center items-center p-12 overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] text-white">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center flex flex-col items-center"
      >
        {/* Floating Icon Container with Gold Accent */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white/10 p-6 rounded-[2rem] backdrop-blur-md border border-white/20 w-fit mx-auto mb-8 shadow-2xl"
        >
          <GraduationCap className="w-16 h-16 text-[#FBBF24]" />
        </motion.div>

        <h2 className="text-4xl font-black mb-4 tracking-tight drop-shadow-md">
          Simplified Scholarship Entry
        </h2>
        <p className="text-[#E0E7FF] text-lg max-w-sm leading-relaxed">
          Let AI guide you to the right educational funds, effortlessly.
        </p>
      </motion.div>

      {/* Footer Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-8 z-10 text-xs text-[#E0E7FF]/70"
      >
        © 2026 ScholarAI Inc. Personal support, at your fingertips.
      </motion.div>
    </div>
  );
}