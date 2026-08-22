import Link from "next/link";
import { Leaf } from "lucide-react";

interface BrandProps {
  showTagline?: boolean;
}

export function Brand({
  showTagline = false,
}: BrandProps) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#263746] text-white shadow-sm">
        <Leaf className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#263746]">
          Wildlife Population Intelligence System
        </h2>

        {showTagline && (
          <p className="text-xs text-muted-foreground">
            Conservation monitoring workspace
          </p>
        )}
      </div>
    </Link>
  );
}
