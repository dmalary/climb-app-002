import { useEffect, useState, useRef } from "react";
import { getUser } from "@/utils/db";
import SessionCard from "@/components/ux/sessions/SessionCard"

export default function Stream({ sessionData = [], getToken, userId }) {
  const BATCH_SIZE = 10;

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [items, setItems] = useState(sessionData.slice(0, BATCH_SIZE));
  const [username, setUsername] = useState("");
  
  const loaderRef = useRef(null);

  // -------------------------------------------
  // Infinite scroll lazy loading
  // -------------------------------------------
  // Reset pagination when data changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    setItems(sessionData.slice(0, BATCH_SIZE));
  }, [sessionData]);

  // Load username (auth-safe)
  useEffect(() => {
    let cancelled = false;

    async function loadUsername() {
      if (!userId) return;
      try {
        const un = await getUser(userId, getToken); // <-- pass getToken
        if (!cancelled) setUsername(un?.username || "");
      } catch (err) {
        console.error("Error loading username:", err);
        if (!cancelled) setUsername("");
      }
    }

    loadUsername();

    return () => {
      cancelled = true;
    };
  }, [userId, getToken]);

  // Infinite scroll observer
  useEffect(() => {
    if (!Array.isArray(sessionData) || sessionData.length === 0) return;

    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        setVisibleCount((prev) => {
          const next = prev + BATCH_SIZE;
          setItems(sessionData.slice(0, next));
          return next;
        });
      },
      { threshold: 1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [sessionData]);

  if (!Array.isArray(sessionData) || sessionData.length === 0) {
    return (
      <div className="text-center text-stone-400 py-12">
        No climbing data yet.<br />
        Import your board to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
    {items.map((session) => (
        <SessionCard
          session={session}
          getToken={getToken}
          username={username}
        />
    ))}

      <div
        ref={loaderRef}
        className="h-10 flex justify-center items-center text-stone-500"
      >
        Loading more…
      </div>
    </div>
  );
}