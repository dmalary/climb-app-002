import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUser, getUserSessions } from "@/utils/db";
import { Skeleton } from "@/components/ui/skeleton";
import Stream from "@/components/ux/Stream";
import AppShell from "@/components/ux/AppShell";

export default function User() {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const userId = router.query.userId;

  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        if (!userId) return;
        // If this page requires auth, uncomment:
        // if (!isSignedIn) return;

        setIsLoading(true);
        setError(null);

        // Fetch user + sessions WITH getToken (fresh each request)
        const [u, sessionsRes] = await Promise.all([
          getUser(userId, getToken),
          getUserSessions(userId, getToken),
        ]);

        setUserData(u);
        setSessions(sessionsRes);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [userId, getToken /*, isSignedIn */]);

  if (isLoading) {
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

  const username = userData?.username || "User";

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mt-4 px-4">
          <div className="h-14 w-14 rounded-full bg-stone-700 flex items-center justify-center text-white text-lg font-semibold">
            {username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-100">{username}</h1>
            <p className="text-sm text-stone-400">
              {Array.isArray(sessions) ? sessions.length : 0} sessions logged
            </p>
          </div>
        </div>

        {/* Pass getToken down, not token */}
        <Stream sessionData={sessions} getToken={getToken} userId={userId} />
      </div>
    </AppShell>
  );
}
