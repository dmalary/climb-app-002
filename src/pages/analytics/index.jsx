"use client";

import { useEffect, useState } from 'react';
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
  const [selectedSession, setSelectedSession] = useState(null);
  const [token, setToken] = useState(null);

  // const [error, setError] = useState(0);
  
  // const { session } = useSession(); // JWT session token, will i need?

  useEffect(() => {
    async function loadFeed() {
      try {
        if (!userId) return;

        setIsLoading(true);
        // const token = await getToken();

        const [mySessions] = await Promise.all([getUserSessions()]);

        const feedData = [...(mySessions || [])]


        setFeed(feedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeed();
  }, [userId])

   // Load user sessions
  useEffect(() => {
    async function loadSessions() {
      if (!userId) return;
      setIsLoading(true);

      try {
        const t = await getToken({ template: "supabase" });
        setToken(t);

        const userSessions = await getUserSessions(userId, t);
        setSessions(userSessions || []);

        if (userSessions && userSessions.length > 0) {
          setSelectedSession(userSessions[0].id); // default selection
        }
      } catch (err) {
        console.error("Error loading sessions:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSessions();
  }, [userId, getToken]);

  // console.log('feed', feed)
  feed && console.log(feed.slice(0,3))

  if (isLoading) {
    return (
      <div className="flex justify-center p-4 bg-stone-900 min-h-screen">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4 bg-stone-900 min-h-screen">
      <div className="w-full max-w-lg mx-auto space-y-6">
        <DynamicNav type="analytics" userId={userId} />
        {/* {error && <div className="text-red-500">Error loading sessions</div>} */}

        <div className="flex flex-col gap-2">
          <label htmlFor="sessionSelect" className="text-white font-semibold">
            Select Session
          </label>
          <select
            id="sessionSelect"
            className="p-2 rounded bg-stone-800 text-white"
            value={selectedSession || ""}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.board} – {new Date(s.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Dashboard */}
        {selectedSession && token && (
          <Dashboard sessionId={selectedSession} token={token} />
        )}
      </div>
    </div>
  );
}