"use client";
import { useState } from "react";

export default function SmartRecommendationPage() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState("");
  const [formData, setFormData] = useState({
    country: "Canada",
    degree: "PHD",
    subject: "Computer Science",
    fundingType: "Fully Funded",
  });

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 
      const res = await fetch("http://localhost:5000/api/ai/recommend", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format Markdown safely without installing any npm packages
  const formatAIResponse = (text: string) => {
    if (!text) return null;

    return text.split("\n").map((line, index) => {
      let currentLine = line.trim();
      if (!currentLine) return <div key={index} className="h-2" />;

      // 1. Check if it's a list/bullet item
      const isBullet = currentLine.startsWith("*") || currentLine.startsWith("-");
      if (isBullet) {
        currentLine = currentLine.replace(/^[\*\-]\s*/, ""); // Clean up the asterisk
      }

      // 2. Parse out **bold text**
      const parts = currentLine.split(/\*\*([\s\S]*?)\*\*/g);
      const renderedContent = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{part}</strong> : part
      );

      // 3. Render as list item or standard paragraph
      if (isBullet) {
        return (
          <li key={index} className="list-disc ml-5 my-1.5 text-gray-700">
            {renderedContent}
          </li>
        );
      }

      return (
        <p key={index} className="my-2 text-gray-700">
          {renderedContent}
        </p>
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left Side: Form */}
      <div>
        <h1 className="text-3xl font-bold mb-6">🤖 AI Scholarship Advisor</h1>
        <div className="space-y-4">
          {["country", "degree", "subject", "fundingType"].map((field) => (
            <div key={field}>
              <label className="block capitalize font-medium mb-1 text-gray-700">{field}</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({...formData, [field]: e.target.value})}
              />
            </div>
          ))}
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold transition-colors"
          >
            {loading ? "🔍 Searching Database..." : "✨ Get Recommendations"}
          </button>
        </div>
      </div>

      {/* Right Side: Results */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-fit">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🎯 AI Recommendations</h2>
        <div className="leading-relaxed text-sm md:text-base">
          {recommendations ? (
            <ul className="list-none">{formatAIResponse(recommendations)}</ul>
          ) : (
            <p className="text-gray-400 italic">
              Select your preferences and click 'Get Recommendations' to see personalized matches from our database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}