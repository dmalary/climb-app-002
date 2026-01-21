import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getClimbImageUrl } from "@/utils/climbImageHelper";

const PLACEHOLDER_SRC = "/images/placeholder.png"; // change to your real path

export default function SessionSendsCarousel({ session, attempts = [], username }) {
  // session can be object or array
  const sessionObj = Array.isArray(session) ? session?.[0] : session;
  const date = sessionObj?.date || sessionObj?.started_at || sessionObj?.start_time;

  const sessionDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  // derive board safely
  const board =
    sessionObj?.board ||
    sessionObj?.board_name ||
    attempts?.[0]?.board ||
    attempts?.[0]?.board_name ||
    "";

  // be flexible about “send” key names
  const sends = attempts.filter((a) =>
    Boolean(a?.isAscent ?? a?.is_ascent ?? a?.isSend ?? a?.is_send ?? a?.sent)
  );

  return (
    <Card className="bg-stone-800 border-none rounded-none">
      <CardHeader className="pb-3">
        <h1 className="text-xl font-semibold text-stone-100">
          {username || "User"}
        </h1>
        {sessionDate && <p className="text-xs text-stone-400">{sessionDate}</p>}
      </CardHeader>

      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {(sends.length ? sends : [{ placeholder: true }]).map((send, i) => {
              const climbUuid = send?.climb_uuid || send?.climbUuid;
              const imageUrl =
                !send.placeholder && board && climbUuid
                  ? getClimbImageUrl(board, climbUuid)
                  : null;

              return (
                <CarouselItem key={i} className="basis-4/5">
                  <div className="h-44 rounded-lg overflow-hidden bg-stone-700 flex items-center justify-center">
                    {send.placeholder ? (
                      <span className="text-xs text-stone-400">No sends</span>
                    ) : imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={send.climb_name || send.name || "Climb image"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER_SRC;
                        }}
                      />
                    ) : (
                      <span className="text-xs text-stone-400">No image yet</span>
                    )}
                  </div>

                  {!send.placeholder && (
                    <div className="mt-2 text-xs text-stone-400">
                      {(send.displayed_grade || send.grade || "—")} @ {(send.angle ?? "—")}° •{" "}
                      {(send.tries_total ?? send.totalTries ?? "—")} tries
                    </div>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}
