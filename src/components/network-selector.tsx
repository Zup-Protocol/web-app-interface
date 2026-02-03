import { cn } from "@/lib/utils";
import { ChevronDown, LayoutGrid } from "lucide-react";

interface NetworkSelectorProps {
  className?: string;
}

export function NetworkSelector({ className }: NetworkSelectorProps) {
  return (
    <button
      className={cn(
        "group flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
        "cursor-pointer select-none",
        className,
      )}
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-green-500/20 text-green-600">
        {/* Placeholder for network icon, using LayoutGrid as generic for now since animated one failed */}
        <LayoutGrid size={16} />
      </div>
      <span className="text-sm font-medium">All Networks</span>
      <ChevronDown
        size={14}
        className="text-muted-foreground group-hover:text-foreground transition-colors"
      />
    </button>
  );
}
