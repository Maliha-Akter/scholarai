"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission for academic demo
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#1D4ED8] selection:text-white pb-20">
      
      {/* HERO SECTION */}
      <section className="pt-20 pb-12 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-black uppercase tracking-widest border border-[#7C3AED]/20 mb-6">
          <MessageSquare size={16} />
          <span>Get In Touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight mb-4">
          We&apos;re Here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] via-[#7C3AED] to-[#1D4ED8]">Help You Succeed</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          Have questions about finding scholarships, using the AI Advisor, or managing your account? Reach out to the ScholarAI team.
        </p>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Contact Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#0F172A]">Contact Information</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Fill out the form or reach out to us directly through any of the official channels below.
              </p>

              <div className="space-y-5 pt-2">
                {/* Email Box */}
                <a href="mailto:support@scholarai.com" className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] hover:bg-blue-50/50 border border-slate-100 transition-all group">
                  <div className="p-3 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded-xl group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Email Us</h3>
                    <p className="text-xs text-slate-500 mt-0.5">For general inquiries & support</p>
                    <p className="text-sm font-semibold text-[#1D4ED8] mt-1">support@scholarai.com</p>
                  </div>
                </a>

                {/* Phone Box */}
                <a href="tel:+8801234567890" className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] hover:bg-purple-50/50 border border-slate-100 transition-all group">
                  <div className="p-3 bg-[#7C3AED]/10 text-[#7C3AED] rounded-xl group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Call Us</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Mon-Fri from 9am to 6pm</p>
                    <p className="text-sm font-semibold text-[#7C3AED] mt-1">+880 1234-567890</p>
                  </div>
                </a>

                {/* Location Box */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                  <div className="p-3 bg-[#FBBF24]/20 text-amber-600 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Office Location</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Academic Project HQ</p>
                    <p className="text-sm font-semibold text-[#0F172A] mt-1">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] text-white p-6 rounded-3xl shadow-md border border-slate-800 flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-[#FBBF24] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Support Hours</h4>
                <p className="text-xs text-slate-400 mt-0.5">Our student support team aims to respond to all queries within 24 hours.</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
              
              {isSubmitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0F172A]">Message Sent Successfully!</h3>
                  <p className="text-slate-500 max-w-md mx-auto text-sm">
                    Thank you for reaching out, <span className="font-bold text-[#0F172A]">{formData.name}</span>. We have received your inquiry and will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => { setIsSubmitted(false); setFormData({ name: "", email: "", subject: "General Inquiry", message: "" }); }}
                    className="mt-6 px-6 py-2.5 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#0F172A]">Send Us a Message</h2>
                    <p className="text-xs text-slate-400 mt-1">Fill out the required fields below and our team will respond soon.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Your Name *</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Arafat Rahman"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm text-[#0F172A] font-medium transition-all"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Email Address *</label>
                      <input 
                        required
                        type="email" 
                        placeholder="e.g. student@university.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm text-[#0F172A] font-medium transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Topic / Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-sm text-[#0F172A] font-medium transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="AI Advisor Issue">AI Advisor & Recommendations</option>
                      <option value="Scholarship Verification">Scholarship Data & Deadlines</option>
                      <option value="Account & Privacy">Account, Login & Privacy</option>
                      <option value="Feedback & Suggestions">Platform Feedback</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Message *</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="How can we help you today? Please include any details..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] text-sm text-[#0F172A] font-medium transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-black text-sm shadow-lg shadow-[#1D4ED8]/20 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}