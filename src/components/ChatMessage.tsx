interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: MessageProps) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser 
            ? "bg-blue-600 text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}