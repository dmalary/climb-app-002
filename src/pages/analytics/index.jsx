"use client";

import { useEffect, useState, useMemo } from 'react';
import { useUser, useAuth } from '@clerk/nextjs'
import { getUsers, getUserSessions } from '@/utils/db';
import { Geist, Geist_Mono } from "next/font/google";
import { Skeleton } from "@/components/ui/skeleton"
import Dashboard from '@/components/ux/dashboard';
import DynamicNav from '@/components/ux/dynamicNav';

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
  // const [data, setData] = useState(0); // this is data for the stream
  const [feed, setFeed] = useState(0); // this is data for the stream
  const [sessions, setSessions] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [token, setToken] = useState(null);
  // const [error, setError] = useState(0);
  // const { session } = useSession(); // JWT session token, will i need?
  
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
  // Extract unique boards from sessions
  // ---------------------------
  const boards = useMemo(() => {
    const all = sessions.map((s) => s.board || "Unknown");
    return Array.from(new Set(all));
  }, [sessions]);

  // ---------------------------
  // Filter sessions based on board selection
  // ---------------------------
  const filteredSessions = useMemo(() => {
    if (selectedBoards.length === 0) return [];
    return sessions.filter((s) => selectedBoards.includes(s.board));
  }, [sessions, selectedBoards]);

  // ---------------------------
  // Handle board multi-select
  // ---------------------------
  const handleBoardSelect = (e) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelectedBoards(values);
    setSelectedSession(""); // reset
  };

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
  // Render
  // ---------------------------
  return (
    <div className="flex justify-center bg-stone-900 min-h-screen">
      <div className="w-full max-w-lg mx-auto space-y-6">
        <DynamicNav type="analytics" userId={userId} />

        {/* ====================================================== */}
        {/*                 BOARD MULTI SELECT                     */}
        {/* ====================================================== */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="boardSelect"
            className="text-white font-semibold flex justify-between"
          >
            Select Board(s)
            <span className="text-xs text-stone-500">
              (Cmd/Ctrl-click to multi-select)
            </span>
          </label>

          <select
            id="boardSelect"
            multiple
            className="p-2 h-32 rounded bg-stone-800 text-white"
            value={selectedBoards}
            onChange={handleBoardSelect}
          >
            {boards.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* ====================================================== */}
        {/*                   SESSION SELECT                       */}
        {/* ====================================================== */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sessionSelect" className="text-white font-semibold">
            Select Session
          </label>

          <select
            id="sessionSelect"
            className="p-2 rounded bg-stone-800 text-white disabled:bg-stone-700"
            value={selectedSession || ""}
            disabled={filteredSessions.length === 0}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">-- Select Session --</option>

            {filteredSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.board} — {new Date(s.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* ====================================================== */}
        {/*                       DASHBOARD                        */}
        {/* ====================================================== */}
        {selectedSession && token && (
          <Dashboard sessionId={selectedSession} token={token} />
        )}
      </div>
    </div>
  );
}