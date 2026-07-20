import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Loading scholarship details...</p>
    </div>
  );
}