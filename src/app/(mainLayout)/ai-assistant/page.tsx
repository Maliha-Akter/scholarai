"use client";
import { useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import SuggestedPrompts from "@/components/SuggestedPrompts";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const newMessages = [...messages, { role: "user", content: text } as Message];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. Send FULL history to backend
      const res = await fetch("http://localhost:5000/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      // 3. Add AI reply
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">🤖 ScholarAI Assistant</h1>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <div className="mt-10">
            <h2 className="text-gray-500 mb-4">Suggested Questions:</h2>
            <SuggestedPrompts onSelect={sendMessage} />
          </div>
        )}
        
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
        
        {loading && (
          <div className="text-gray-500 animate-pulse text-sm">ScholarAI is typing...</div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask about scholarships..."
        />
        <button 
          onClick={() => sendMessage(input)}
          disabled={loading}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}