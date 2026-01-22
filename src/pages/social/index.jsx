"use client";

import { useEffect, useState, useMemo } from 'react';
import { useUser, useAuth } from '@clerk/nextjs'
import { getUsers, getUserSessions, getUserAttempts } from '@/utils/db';
import { Geist, Geist_Mono } from "next/font/google";
import { Skeleton } from "@/components/ui/skeleton"
import AppShell from "@/components/ux/AppShell";

import StatsOverall from "@/components/ux/stats/StatsOverall";
import StatsBoard from "@/components/ux/stats/StatsBoard";
import StatsSession from "@/components/ux/stats/StatsSession";

import { normalizeVGrade } from "@/utils/grades";

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
  
  const [sessions, setSessions] = useState([]);
  const [rawAttempts, setRawAttempts] = useState([]);
  // const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedView, setSelectedView] = useState("leaderboards"); 
  const [isLoading, setIsLoading] = useState(true);
  // const [token, setToken] = useState(null);
  // const [error, setError] = useState(0);
    
  // ---------------------------
  // Fetch sessions + attempts
  // ---------------------------
  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      setIsLoading(true);

      try {
        // const token = await getToken({ template: "supabase" });

        // const userSessions = await getUserSessions(userId, token);
        const userSessions = await getUserSessions(userId, getToken);
        setSessions(userSessions || []);

        // const attempts = await getUserAttempts(userId, token);
        const attempts = await getUserAttempts(userId, getToken);
        // console.log('attempts', attempts)

        // 🔑 Normalize grades ONCE here
        const normalized = (attempts || []).map(a => {
          const grade = normalizeVGrade(a.displayed_grade);
          return {
            ...a,
            grade,
            gradeNum: grade ? Number(grade.replace("V", "")) : null,
          };
        });

        setRawAttempts(normalized);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
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
      return (
        <StatsOverall
          rawAttempts={rawAttempts}
          isLoading={isLoading}
        />
      );

    if (selectedView === "board")
      return (
        <StatsBoard
          sessions={sessions}
          rawAttempts={rawAttempts}
          isLoading={isLoading}
        />
      );

    if (selectedView === "session")
      return (
        <StatsSession
          sessions={sessions}
          rawAttempts={rawAttempts}
          isLoading={isLoading}
        />
      );

    return null;
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <AppShell>
      <div className="flex justify-center bg-stone-900 min-h-screen p-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          COMING SOON
          {/* View Switcher */}
          {/* <div className="flex w-full rounded-xl bg-stone-800 p-1">
            {["leaderboards", "challenges"].map((view) => (
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
          </div> */}

          {/* Analytics View Content */}
          {/* <div className="mt-4">
            {renderView()}
          </div> */}
          {/* update to handle leaderboards | challenges */}

        </div>
      </div>
    </AppShell>
  );
}