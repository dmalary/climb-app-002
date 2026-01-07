"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";

export default function TopNav() {
  const pathname = usePathname();

  const isProfile = pathname.startsWith("/profile");

  return (
    <div className="sticky top-0 z-50 border-b border-stone-800 bg-stone-900">
      <div className="max-w-lg mx-auto h-14 px-4 flex items-center justify-between">
        <div className="text-stone-200 font-semibold">
          Climb
        </div>

        <div className="flex items-center gap-3">
          {isProfile && (
            <button className="text-stone-400 hover:text-white">
              <Settings size={20} />
            </button>
          )}
          <UserButton />
        </div>
      </div>
    </div>
  );
}
