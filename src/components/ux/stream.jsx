import { useEffect, useState, useRef } from "react";
import { getSessionAttempts } from "@/utils/db";
import { getUser } from "@/utils/db";

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

import { GradeDistributionBar, MiniGradeDistributionBar} from "@/components/charts/GradeDistributionBar";
import { getGradeHistogram } from "@/utils/analytics/getGrades";
import { cleanAttempts } from "@/utils/analytics/getAttempts";

import { Heart, MessageSquareText, Share } from "lucide-react";

export default function Stream({ sessionData, token, userId }) {
  const BATCH_SIZE = 10;

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [items, setItems] = useState(sessionData.slice(0, BATCH_SIZE));
  const loaderRef = useRef(null);
  const [username, setUsername] = useState(null);

  console.log('userId', userId) // get username from userID, pass down to card
  // -------------------------------------------
  // Infinite scroll lazy loading
  // -------------------------------------------
  useEffect(() => {
    async function loadUsername() {
      if (!userId) return;

      try {
        const un = await getUser(userId, token);
        setUsername(un.username || "");
      } catch (err) {
        console.error("Error loading usename:", err);
      }
    }

    loadUsername();

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

    console.log('username', username)

return (
    <div className="flex flex-col gap-4 w-full">
      {/* make entire card clickable to view session as post (breakdown) */}

      {items.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          token={token}
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

/* ============================================================
   Single Session Card — loads its own attempts on mount
   ============================================================ */

// add session summary mini card

function SessionCard({ session, token, username }) {
  const [attempts, setAttempts] = useState(null);
  const [gradeDistributionData, setGradeDistributionData] = useState([]);

  useEffect(() => {
    async function loadAttempts() {
      const data = await getSessionAttempts(session.id, token);
      setAttempts(data || []);

      const cleaned = cleanAttempts(data);
      setGradeDistributionData(getGradeHistogram(cleaned));
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
  const board = (attempts && attempts[0]?.board) || "b";
  const angles = [...new Set(sends.map((s) => s.angle))];

  console.log('gradeDistributionData', gradeDistributionData)

  return (
    <Card className="bg-stone-800 border-stone-700 text-white rounded-2xl shadow-md">
      {/* --- Header --- */}
      <CardHeader className="pb-2">
        <div className="flex gap-4">

          {/* LEFT — USER INFO (2/3) */}
          <div className="w-2/3 flex flex-col justify-between">

            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-stone-700 flex items-center justify-center text-white text-lg font-semibold">
                {(username && username[0]?.toUpperCase()) || "U"}
              </div>

              <div>
                <h1 className="text-xl font-semibold text-stone-100">
                  {username || "User"}
                </h1>

                <p className="text-xs text-stone-400">
                  {sessionDate || ""}
                </p>

                <p className="text-xs text-stone-500 mt-1">
                  {`${board.charAt(0).toUpperCase()}${board.slice(1)} Board`} • (gym loc)
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT — MINI CARD (1/3) */}
          {/* <div className="w-1/3">
            <Card className="bg-stone-800 border-stone-700 pb-0">
              <CardContent className="px-1 pb-1">
                <MiniGradeDistributionBar data={gradeDistributionData} />
              </CardContent>
            </Card>
          </div> */}

        </div>
      </CardHeader>


      {/* --- Content --- */}
      <CardContent className="text-sm text-stone-300 space-y-3">
        <div className="flex gap-6">
          {/* Sends */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-stone-500 uppercase tracking-wide">Sends</span>
            <span className="text-stone-200 text-lg font-semibold">
              {attempts ? sends.length : "–"}
            </span>
          </div>

          {/* Climbs */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-stone-500 uppercase tracking-wide">Climbs</span>
            <span className="text-stone-200 text-lg font-semibold">
              {attempts ? attempts.length : "–"}
            </span>
          </div>

          {/* Angles */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-stone-500 uppercase tracking-wide">Angle(s)</span>
            <span className="text-stone-200 text-lg font-semibold">
              {attempts && angles?.length > 0 
                ? angles.join(", ")
                : "–"}
            </span>
          </div>
        </div>

        {/* --- Carousel of sends --- */}
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {(sends.length ? sends : [{ placeholder: true }]).map(
                (send, i) => (
                  <CarouselItem key={i} className="basis-4/5">
                    <div className="h-44 bg-stone-700 rounded-lg flex items-center justify-center text-xs text-stone-400">
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
      <CardFooter className="pt-2 pl-10 pr-10 text-xs text-stone-500">
        <div className="w-full flex justify-between">

          {/* Like */}
          <button className="flex items-center gap-1 hover:text-stone-300 transition">
            <Heart className="h-5 w-5" />
            {/* add hyperlinks */}
          </button>

          {/* Comment */}
          <button className="flex items-center gap-1 hover:text-stone-300 transition">
            <MessageSquareText className="h-5 w-5" />
            {/* add hyperlinks */}
          </button>

          {/* Share */}
          <button className="flex items-center gap-1 hover:text-stone-300 transition">
            <Share className="h-5 w-5" />
            {/* add hyperlinks */}
          </button>

        </div>
      </CardFooter>
    </Card>
  );
}