"use client";

import { useEffect, useState, useMemo } from 'react';
import { useUser, useAuth } from '@clerk/nextjs'
import { getUsers, getUserSessions } from '@/utils/db';
import { getSessionAttempts } from "@/utils/db";
import { Geist, Geist_Mono } from "next/font/google";
import { Skeleton } from "@/components/ui/skeleton"
import Dashboard from '@/components/ux/dashboard';
import DynamicNav from '@/components/ux/dynamicNav';

import StatsOverall from "@/components/ux/statsOverall";
import StatsBoard from "@/components/ux/statsBoard";
import StatsSession from "@/components/ux/statsSession";

// load shadcn skeletons on initial load while fecthing data?

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { userId, getToken, isSignedIn } = useAuth();
  // const { user } = useUser(); // user should already exist on this page
  const [isLoading, setIsLoading] = useState(true);

  const [sessions, setSessions] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedView, setSelectedView] = useState("overall"); 
  const [token, setToken] = useState(null);
  // const [error, setError] = useState(0);
  
 // ---------------------------
  // Fetch sessions
  // ---------------------------
  useEffect(() => {
    async function loadSessions() {
      if (!userId) return;
      setIsLoading(true);

      try {
        const t = await getToken({ template: "supabase" });
        setToken(t);

        const userSessions = await getUserSessions(userId, t);
        setSessions(userSessions || []);
      } catch (err) {
        console.error("Error loading sessions:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSessions();
  }, [userId, getToken]);


  // ---------------------------
  // Skeleton while loading
  // ---------------------------
  if (isLoading) {
    return (
      <div className="flex justify-center bg-stone-900 min-h-screen">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
      </div>
    );
  }


  // ---------------------------
  // Component router based on selectedView
  // ---------------------------
  const renderView = () => {
    if (selectedView === "overall")
      return <div>StatsOverall</div>
      // return <StatsOverall sessions={sessions} />;

    if (selectedView === "board")
      return <div>StatsBoard</div>
      // return <StatsBoard sessions={sessions} />;

    if (selectedView === "session")
      return <div>StatsSession</div>
      // return <StatsSession sessions={sessions} />;

    return null;
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="flex justify-center bg-stone-900 min-h-screen p-4">
      <div className="w-full max-w-lg mx-auto space-y-6">

        {/* Nav */}
        <DynamicNav type="analytics" userId={userId} />

        {/* View Switcher */}
        <div className="flex w-full rounded-xl bg-stone-800 p-1">
          {["overall", "board", "session"].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`
                flex-1 py-2 text-sm font-medium capitalize rounded-lg 
                transition-all duration-200
                ${
                  selectedView === view
                    ? "bg-stone-700 text-white"
                    : "text-stone-400 hover:text-white"
                }
              `}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Analytics View Content */}
        <div className="mt-4">
          {renderView()}
        </div>

      </div>
    </div>
  );
}