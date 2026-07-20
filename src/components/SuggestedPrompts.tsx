const SUGGESTIONS = [
  "Recommend scholarships for Computer Science",
  "Study in Germany",
  "Fully funded scholarships",
  "Explain SOP",
  "Upcoming deadlines"
];

export default function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {SUGGESTIONS.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
        >
          {text}
        </button>
      ))}
    </div>
  );
}