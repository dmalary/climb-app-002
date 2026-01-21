"use client";

import { useEffect, useState } from 'react';
// import { useSession, useUser, useAuth, getToken } from '@clerk/nextjs'
import { useUser, useAuth } from '@clerk/nextjs'
import { getUsers, getUserSessions, getAllSessions, getUserAttempts, getAllAttempts } from '@/utils/db';
// import { getMainFeed } from "@/services/mainFeed"
import { Geist, Geist_Mono } from "next/font/google";
import { Skeleton } from "@/components/ui/skeleton"
import Stream from '@/components/ux/Stream';
// import SyncPublic from '@/components/ux/SyncPublic';
import AppShell from "@/components/ux/AppShell";

// load shadcn skeletons on initial load while fecthing data?

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// when i log in and land on this page, i want my user data to load/update db, and update cached? data

export default function Home() {
  const { userId, getToken, isSignedIn } = useAuth();
  const { user } = useUser(); // user should already exist on this page
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(0);
  
  const [sessions, setSessions] = useState([]);
  // const { session } = useSession(); // JWT session token, will i need?

  useEffect(() => {
    async function loadFeed() {
      try {
        if (!userId) return;

        setIsLoading(true);
        const t = await getToken();
        setToken(t);

        // const [mySessions, followingSessions] = await Promise.all([
        //   getUserSessions(user, token),
        //   getUserFollowSessions(user.id, token)
        // ]);
        // const [mySessions] = await Promise.all([getUserSessions()]);
        const [allSessions] = await Promise.all([getAllSessions()]);
        // const [allSessions] = await getAllSessions();

        // const feedData = [...mySessions , ...followingSessions]
        // const feedData = [...(mySessions || [])]
        // const sessionData = [...(allSessions || [])]
        const sessionData = Array.isArray(allSessions) ? allSessions : [];
                
        // .sort(
        //   (a, b) => new Date(b.date) - new Date(a.date)
        // );

        setSessions(sessionData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeed();
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex justify-center bg-stone-900 min-h-screen px-4">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div className="flex justify-center bg-stone-900 min-h-screen">
        <div className="w-full max-w-lg mx-auto space-y-6">

          <Stream sessionData={sessions} token={token} userId={userId}/>

        </div>
      </div>
    </AppShell>
  );
}