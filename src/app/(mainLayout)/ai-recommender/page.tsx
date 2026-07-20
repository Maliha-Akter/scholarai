"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

interface FilterOptions {
  countries: string[];
  degrees: string[];
  subjects: string[];
  fundingTypes: string[];
}

export default function SmartRecommendationPage() {
  const [formData, setFormData] = useState({
    country: "",
    degree: "",
    subject: "",
    fundingType: "",
  });

  // 1. Fetching filters using useQuery instead of useEffect
  const { data: options = { countries: [], degrees: [], subjects: [], fundingTypes: [] }, isLoading: filterLoading } = useQuery<FilterOptions>({
    queryKey: ["filters"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/filters`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      
      return {
        countries: data.countries || [],
        degrees: data.degrees || [],
        subjects: data.subjects || [],
        fundingTypes: data.fundingTypes || []
      };
    },
  });

  // 2. Handling recommendation generation using useMutation
  const recommendMutation = useMutation({
    mutationFn: async (submitData: typeof formData) => {
      const token = localStorage.getItem("token"); 
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/recommend`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) throw new Error("Error connecting to Advisor Engine");
      
      const data = await res.json();
      return data.recommendations || "No recommendations generated.";
    }
  });

  // Regular Expression markdown parser for live formatting outputs
  const formatAIResponse = (text: string) => {
    if (!text) return null;
    
    return text.split("\n").map((line, index) => {
      let currentLine = line.trim();
      if (!currentLine) return <div key={index} className="h-3" />;
      
      // Catches standard list markup blocks (`*`, `-`, `1.`, `2.`)
      const isBullet = /^[\*\-\+]|^\d+\.\s/.test(currentLine);
      if (isBullet) {
        currentLine = currentLine.replace(/^([\*\-\+]\s*|\d+\.\s*)/, "");
      }

      // Convert Markdown bold (**text**) parameters into inline style elements
      const parts = currentLine.split(/\*\*([\s\S]*?)\*\*/g);
      const renderedContent = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900 bg-blue-50/70 px-1 rounded">{part}</strong> : part
      );

      if (isBullet) {
        return (
          <li key={index} className="list-disc ml-6 my-2 text-gray-700 marker:text-blue-500">
            {renderedContent}
          </li>
        );
      }
      
      if (currentLine.startsWith("###")) {
         return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-gray-850">{currentLine.replace("###", "")}</h3>;
      }
      
      if (currentLine.startsWith("---")) {
        return <hr key={index} className="my-4 border-gray-200" />;
      }

      return <p key={index} className="my-2 text-gray-700 leading-relaxed">{renderedContent}</p>;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      
      {/* Input Selection Block */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span>🤖</span> AI Scholarship Advisor
        </h1>
        <p className="text-sm text-gray-400 mb-6">Select your exact criteria matching real-time database entries.</p>
        
        <div className="space-y-4">
          
          {/* Target Country Dropdown Selection */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 text-sm">Country</label>
            <select 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 text-gray-800"
              value={formData.country}
              disabled={filterLoading}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
            >
              <option value="">🌍 Any Country</option>
              {options.countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Degree Selector */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 text-sm">Degree</label>
            <select 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 text-gray-800"
              value={formData.degree}
              disabled={filterLoading}
              onChange={(e) => setFormData({...formData, degree: e.target.value})}
            >
              <option value="">🎓 Any Degree</option>
              {options.degrees.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 text-sm">Subject</label>
            <select 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 text-gray-800"
              value={formData.subject}
              disabled={filterLoading}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            >
              <option value="">📚 Any Subject</option>
              {options.subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Funding Selector */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 text-sm">Funding Type</label>
            <select 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 text-gray-800"
              value={formData.fundingType}
              disabled={filterLoading}
              onChange={(e) => setFormData({...formData, fundingType: e.target.value})}
            >
              <option value="">💰 Any Funding</option>
              {options.fundingTypes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => recommendMutation.mutate(formData)}
            disabled={recommendMutation.isPending || filterLoading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold mt-4 shadow-md transition-all active:scale-[0.99]"
          >
            {recommendMutation.isPending ? "🔍 Analyzing Database..." : "✨ Get Recommendations"}
          </button>
        </div>
      </div>

      {/* Output Presentation Block */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 min-h-[400px] h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 border-b pb-2 border-gray-200">
          <span>🎯</span> AI Recommendations
        </h2>
        <div className="text-gray-700 text-sm leading-relaxed">
          {recommendMutation.isPending ? (
            <div className="space-y-3 animate-pulse mt-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : recommendMutation.isError ? (
            <p className="text-red-500 font-medium">⚠️ Error connecting to Advisor Engine. Verify backend status.</p>
          ) : recommendMutation.data ? (
            <div className="space-y-1">{formatAIResponse(recommendMutation.data)}</div>
          ) : (
            <p className="text-gray-400 italic text-center pt-12">
              Select your options and click 'Get Recommendations' to see weighted matches.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}