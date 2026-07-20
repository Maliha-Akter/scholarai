const DEFAULT_SUGGESTIONS = [
  "🎓 Find fully funded Computer Science options",
  "🇩🇪 Explain how to study in Germany",
  "📅 Show scholarships closing this month",
  "📄 How do I write an impactful SOP?",
  "📌 Where can I view my saved scholarships?"
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  customSuggestions: string[] | null;
}

export default function SuggestedPrompts({ onSelect, customSuggestions }: SuggestedPromptsProps) {
  const displayList = customSuggestions && customSuggestions.length > 0 ? customSuggestions : DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {displayList.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition shadow-sm text-gray-600 text-left"
        >
          {text}
        </button>
      ))}
    </div>
  );
}