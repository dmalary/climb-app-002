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

import { getGradeHistogram, cleanAttempts } from "@/utils/analytics";

import { Heart, MessageSquareText, Share } from "lucide-react";

import { getClimbImageUrl } from "@/utils/climbImageHelper";

/* ============================================================
   Single Session Card — loads its own attempts on mount
   ============================================================ */

// add session summary mini card

export default function SessionCard({ session, token, username }) {
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

  const PLACEHOLDER_SRC = "/assets/climb-placeholder.png"; // local static asset

  // console.log('gradeDistributionData', gradeDistributionData)

  return (
    <Card className="bg-stone-800 border-none text-white rounded-none shadow-md">
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
        {/* <div className="w-full">
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
        </div> */}

        {/* --- Carousel of sends --- */}
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {(sends.length ? sends : [{ placeholder: true }]).map(
                (send, i) => {
                  const imageUrl =
                    // !send.placeholder && send.climb_id
                    //   ? getClimbImageUrl(board, send.climb_id)
                    //   : null;
                    !send.placeholder && send.climb_uuid
                      ? getClimbImageUrl(board, send.climb_uuid)
                      : null;

                  return (
                    <CarouselItem key={i} className="basis-4/5">
                      <div className="h-44 rounded-lg overflow-hidden bg-stone-700 flex items-center justify-center">
                        {send.placeholder ? (
                          <span className="text-xs text-stone-400">No sends</span>
                        ) : (
                          <img
                            src={imageUrl}
                            alt={send.climb_name || "Climb image"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER_SRC;
                            }}
                          />
                        )}
                      </div>

                      {!send.placeholder && (
                        <div className="mt-2 text-xs text-stone-400">
                          {send.displayed_grade} @ {send.angle}° • {send.tries_total} tries
                        </div>
                      )}
                    </CarouselItem>
                  );
                }
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