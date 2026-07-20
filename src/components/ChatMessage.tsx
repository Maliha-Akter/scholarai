interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: MessageProps) {
  const isUser = role === "user";

  // Simple inline parser function to handle common markdown elements safely
  const formatMarkdownText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Handle bold transformations (**text**)
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      
      // Handle simple list rendering conversion
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[-•]\s*/, "") }} 
          />
        );
      }
      
      return (
        <p key={idx} className="text-sm min-h-[1.25rem] leading-relaxed mb-1" 
           dangerouslySetInnerHTML={{ __html: formattedLine }} 
        />
      );
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`max-w-[85%] p-4 rounded-2xl shadow-sm border ${
          isUser 
            ? "bg-blue-600 text-white border-blue-700 rounded-tr-none" 
            : "bg-gray-50 text-gray-800 border-gray-100 rounded-tl-none"
        }`}
      >
        {isUser ? <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p> : <div>{formatMarkdownText(content)}</div>}
      </div>
    </div>
  );
}