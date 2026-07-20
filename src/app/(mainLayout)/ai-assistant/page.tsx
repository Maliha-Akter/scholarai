"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";
import SuggestedPrompts from "@/components/SuggestedPrompts";
import { Send, Trash2, Loader2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistantPage() {
  // Hook into your session state
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  // Extract user ID, fallback to "guest" if not loaded/logged in
  const userId = session?.user?.id || "guest";
  const storageKey = `scholar_chat_history_${userId}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load conversation tailored to the specific logged-in user
  useEffect(() => {
    if (sessionLoading) return; // Wait until the session state is determined

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    } else {
      setMessages([]); 
    }
  }, [userId, sessionLoading, storageKey]);

  // Save conversation changes under the user-specific key with Quota Protection
  useEffect(() => {
    if (sessionLoading) return;
    if (messages.length > 0 && userId) {
      try {
        // Try to save the messages to local storage
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (error) {
        // If localStorage is full (QuotaExceededError), it falls into this catch block
        console.warn("LocalStorage is full! Clearing history to prevent crash...", error);
        
        // 1. Clear the storage for this user
        localStorage.removeItem(storageKey);
        
        // 2. Clear the UI state so it doesn't immediately try to re-save the massive array
        setMessages([]);
        setFollowUps([]);
      }
    }
  }, [messages, userId, sessionLoading, storageKey]);

  // Keep internal box scrolling contained
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const clearChat = () => {
    setMessages([]);
    setFollowUps([]);
    localStorage.removeItem(storageKey);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setFollowUps([]);
    
    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.body) throw new Error("No readable response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setLoading(false); 

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);
        streamedContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].content = streamedContent;
          }
          return updated;
        });
      }

      if (streamedContent.includes("|||")) {
        const [textPart, jsonPart] = streamedContent.split("|||");
        
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].content = textPart.trim();
          }
          return updated;
        });

        try {
          const parsedPrompts = JSON.parse(jsonPart.trim());
          if (Array.isArray(parsedPrompts)) {
            setFollowUps(parsedPrompts);
          }
        } catch (e) {
          console.error("Failed to parse dynamic follow up prompts", e);
        }
      }

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I encountered an issue connection. Please try again." }
      ]);
      setLoading(false);
    }
  };

  // Prevent UI rendering/flickering while checking if a user is logged in
  if (sessionLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
        <p className="text-sm text-gray-500">Loading your conversation profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 h-screen flex flex-col bg-white">
      {/* Header & Clear Button */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🤖</span> ScholarAI Assistant
        </h1>
        {messages.length > 0 && (
          <button 
            onClick={clearChat}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
          >
            <Trash2 size={16} /> Clear Chat
          </button>
        )}
      </div>

      {/* Chat Box Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4"
      >
        {messages.length === 0 && (
          <div className="mt-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}! 👋
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              I can help you search for funding options, draft application statements, track deadlines, or find pages across your portal profile dashboard.
            </p>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested Topics:</h3>
            <SuggestedPrompts onSelect={sendMessage} customSuggestions={null} />
          </div>
        )}
        
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
        
        {/* Typing Dots Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 max-w-[120px] p-3 rounded-2xl rounded-tl-none border">
            <span className="flex gap-1">
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
            </span>
          </div>
        )}

        {/* Suggested Follow-ups */}
        {!loading && followUps.length > 0 && (
          <div className="pt-2 animate-fadeIn">
            <p className="text-xs font-semibold text-gray-400 mb-2 pl-1">Suggested Follow-ups:</p>
            <SuggestedPrompts onSelect={sendMessage} customSuggestions={followUps} />
          </div>
        )}
      </div>

      {/* Input controls */}
      <div className="flex gap-2 border-t pt-4">
        <input
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
          placeholder={loading ? "Waiting for response..." : "Ask about scholarships or site navigation..."}
        />
        <button 
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}