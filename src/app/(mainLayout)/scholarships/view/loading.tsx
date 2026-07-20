import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  // This will automatically show up while your page.tsx is loading
  return (
    <div className="container mx-auto px-4 py-12">
      <LoadingSpinner />
    </div>
  );
}