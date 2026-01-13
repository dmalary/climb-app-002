// eventually have a filter menu on the analytics sessions page. 
// session analytics will be accessible from session cards (stream + user stream) AND analytics page with filters (filters render a filtered stream)

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";

import { getSession, getSessionAttempts } from "@/utils/db";
import { cleanAttempts } from "@/utils/analytics";

import { getSessionNums } from "@/utils/analytics/getSessionNums";
import { getSessionCharts } from "@/utils/analytics/getSessionCharts";

import { Skeleton } from "@/components/ui/skeleton";

import SessionSendsCarousel from "@/components/ux/sessions/SessionSendsCarousel";
import SessionNumsCard from "@/components/ux/sessions/SessionNumsCard";
import SessionChartsCard from "@/components/ux/sessions/SessionChartsCard";
import AppShell from "@/components/ux/AppShell";

import { ChevronLeft } from "lucide-react";

export default function SessionDetailsPage() {
  const username = "U";

  const router = useRouter();
  const { sessionId } = router.query;
  
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState(null);

  const [session, setSession] = useState(null);
  const [attempts, setAttempts] = useState(null);

  // 🔐 get token
  useEffect(() => {
    if (!isSignedIn) return;

    async function loadToken() {
      const t = await getToken();
      setToken(t);
    }

    loadToken();
  }, [isSignedIn, getToken]);

  // 📦 fetch session data
  useEffect(() => {
    if (!router.isReady || !sessionId || !token) return;

    async function loadSession() {
      const s = await getSession(sessionId, token);
      const a = await getSessionAttempts(sessionId, token);

      setSession(s);
      setAttempts(cleanAttempts(a || []));
    }

    loadSession();
  }, [router.isReady, sessionId, token]);

  const handleBack = () => {
    const returnPath = sessionStorage.getItem("sessionReturnPath");

    if (returnPath) {
      sessionStorage.removeItem("sessionReturnPath");
      router.push(returnPath);
    } else {
      router.back(); // fallback if they landed directly
    }
  };

  const sessionNums = useMemo(() => {
    if (!attempts) return null;
    return getSessionNums(attempts);
  }, [attempts]);

  const sessionCharts = useMemo(() => {
    if (!attempts) return null;
    return getSessionCharts(attempts);
  }, [attempts]);

  if (!attempts) {
    // return <div className="p-6 text-stone-400">Loading session…</div>;
    return (
      <div className="space-y-6 px-4">
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

  return (
    <AppShell>
      <div className="space-y-8 py-6 flex flex-col gap-2">
        {/* Top carousel turn stream SessionCard into component?*/}
        <div className="flex items-center gap-3 px-4 mb-3">
          <button
            // onClick={handleBack}
            className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:bg-stone-700 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-stone-400 text-sm">Back</span>
        </div>

        <SessionSendsCarousel
          session={[session]}
          attempts={attempts}
          username={username}
        />
        {/* Numbers overview */}
        <SessionNumsCard
          session={session}
          nums={sessionNums}
        />
        {/* Charts */}
        <SessionChartsCard charts={sessionCharts} />
      </div>
    </AppShell>
  );
}
