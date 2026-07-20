"use client";

import { useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import SuggestedPrompts from "@/components/SuggestedPrompts";
import { Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // 1. TanStack Query Mutation for handling the API request
  const chatMutation = useMutation({
    mutationFn: async (updatedMessages: Message[]) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      
      if (!res.ok) throw new Error("Failed to fetch AI reply");
      
      const data = await res.json();
      return data.reply;
    },
    onSuccess: (reply, variables) => {
      // 'variables' contains the message history (including the user's new message)
      // We append the assistant's reply to it.
      setMessages([...variables, { role: "assistant", content: reply }]);
    },
    onError: (err) => {
      console.error("Chat error:", err);
      // Optional: Show an error message in the chat
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "⚠️ Sorry, I encountered an error. Please try again." }
      ]);
    },
  });

  // 2. Updated sendMessage handler
  const sendMessage = (text: string) => {
    if (!text.trim() || chatMutation.isPending) return;

    // Create the new message array immediately
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    
    // Update local UI immediately so the user's message appears instantly
    setMessages(newMessages);
    setInput("");

    // Trigger the mutation to fetch the AI response
    chatMutation.mutate(newMessages);
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
        
        {/* Replaced 'loading' with 'chatMutation.isPending' */}
        {chatMutation.isPending && (
          <div className="text-gray-500 animate-pulse text-sm">ScholarAI is typing...</div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          disabled={chatMutation.isPending}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
          placeholder="Ask about scholarships..."
        />
        <button 
          onClick={() => sendMessage(input)}
          disabled={chatMutation.isPending || !input.trim()}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}