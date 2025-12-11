"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUser, getUserSessions } from "@/utils/db";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicNav from '@/components/ux/dynamicNav';
import Grid from "@/components/ux/grid";
import Stream from '@/components/ux/stream';

export default function User() {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const userId = router.query.userId;

  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [feed, setFeed] = useState(0); // this is data for the stream

  useEffect(() => {
    async function loadData() {
      try {
        if (!userId) return;
        // if (!userId || !isSignedIn) return;

        setIsLoading(true);
        // const token = await getToken();
        // const userRes = await getUser(userId);
        // setUserData(userRes);

        const sessionsRes = await getUserSessions(userId);
        setSessions(sessionsRes);
        // const sessionsRes = await Promise.all([getUserSessions(userId)]);
        // setSessions([...(sessionsRes || [])]);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }


    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // if (!userData) {
  //   return (
  //     <div className="text-center text-stone-300 p-6">
  //       Could not load user profile.
  //     </div>
  //   );
  // }
  // console.log('userData', userData) // currently returning null FIX!

  const sends = 4; // temp placeholder from your logic

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <DynamicNav type="profile" userId={userId} />

      {/* User Header */}
      <div className="flex items-center gap-4 mt-4">
        <div className="h-14 w-14 rounded-full bg-stone-700 flex items-center justify-center text-white text-lg font-semibold">
          {/* {userData?.username?.[0]?.toUpperCase() || "U"} */}
          {"U"}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-100">
            {/* {userData?.username || "User"} */}
            {"User"}
          </h1>
          <p className="text-sm text-stone-400">
            {sessions?.length || 0} sessions logged
          </p>
        </div>
      </div>

      {/* Grid (your stats + charts) */}
      {/* <Grid sessionData={sessions} sends={sends} /> */}
      <Stream sessionData={sessions} attempts={sends} />
    </div>
  );
}
