import { useEffect, useState, useRef } from "react";
import { getSessionAttempts } from "@/utils/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";


export default function Stream({ sessionData, token }) {
  const BATCH_SIZE = 10;

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [items, setItems] = useState(sessionData.slice(0, BATCH_SIZE));
  const loaderRef = useRef(null);

  // -------------------------------------------
  // Infinite scroll lazy loading
  // -------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextCount = visibleCount + BATCH_SIZE;
          setVisibleCount(nextCount);
          setItems(sessionData.slice(0, nextCount));
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [visibleCount, sessionData]);


return (
    <div className="flex flex-col gap-4 w-full">

      {items.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          token={token}
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


/* ============================================================
   Single Session Card — loads its own attempts on mount
   ============================================================ */

// last card has session summary? or within session card

function SessionCard({ session, token }) {
  const [attempts, setAttempts] = useState(null);

  useEffect(() => {
    async function loadAttempts() {
      const data = await getSessionAttempts(session.id, token);
      setAttempts(data || []);
    }
    loadAttempts();
  }, [session.id, token]);

  const sessionDate = new Date(session.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Count sends (assuming result === "send")
  const sends = attempts?.filter((a) => a.is_ascent) || [];

  return (
    <Card className="bg-stone-800 border-stone-700 text-white rounded-2xl shadow-md">
      {/* --- Header --- */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          {attempts ? `${sends.length} Sends` : "Loading…"}
        </CardTitle>
        <CardDescription className="text-stone-400 text-sm">
          {sessionDate} • {attempts && ` ${attempts[0].board} Board`} 
          {/* • {session.angle}° */}
        </CardDescription>
      </CardHeader>

      {/* --- Content --- */}
      <CardContent className="text-sm text-stone-300 space-y-3">
        <p className="text-stone-300">
          {attempts
            ? `${attempts.length} total attempts`
            : "Fetching attempts…"}
        </p>

        {/* --- Carousel of sends --- */}
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {(sends.length ? sends : [{ placeholder: true }]).map(
                (send, i) => (
                  <CarouselItem key={i} className="basis-4/5">
                    <div className="h-28 bg-stone-700 rounded-lg flex items-center justify-center text-xs text-stone-400">
                      {send.placeholder
                        ? "No sends"
                        : `${send.displayed_grade} @ ${send.angle} • ${send.tries_total} tries`}
                    </div>
                  </CarouselItem>
                )
              )}
            </CarouselContent>
          </Carousel>
        </div>
      </CardContent>

      {/* --- Footer --- */}
      <CardFooter className="pt-2 text-xs text-stone-500 flex justify-between">
        <span>View details</span>
      </CardFooter>
    </Card>
  );
}