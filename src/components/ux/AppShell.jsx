"use client";

import TopNav from "@/components/ux/TopNav";
import BottomNav from "@/components/ux/BottomNav";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      <TopNav />

      {/* main scrollable area */}
      <main className="flex-1 overflow-y-auto pb-1">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
