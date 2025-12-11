import { useEffect, useState, useRef } from "react";

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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


export default function Stream({ sessionData, attempts }) {
  const BATCH_SIZE = 10;

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [items, setItems] = useState(sessionData.slice(0, BATCH_SIZE));
  const loaderRef = useRef(null);

  // Load more when observer triggers
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

  // get sends from attempts
  const sends = [1, 2, 3];


  return (
    <div className="flex flex-col gap-4 w-full">

      {items.map((session) => {
        const sessionDate = new Date(session.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <Card
            key={session.id}
            className="bg-stone-800 border-stone-700 text-white rounded-2xl shadow-md"
          >
            {/* --- Header --- */}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                {attempts} Sends
              </CardTitle>
              <CardDescription className="text-stone-400 text-sm">
                {sessionDate} • {session.board || "Board"} • {session.angle}°
              </CardDescription>
            </CardHeader>

            {/* --- Content --- */}
            <CardContent className="text-sm text-stone-300 space-y-3">

              <p className="text-stone-300">
                {session.attempts_count
                  ? `${session.attempts_count} total attempts`
                  : "Attempts data unavailable"}
              </p>

              {/* --- Carousel --- */}
              <div className="w-full">
                <Carousel className="w-full">
                  <CarouselContent>
                    {sends.map((send, i) => {
                      return (
                      <CarouselItem key={i} className="basis-4/5">
                        <div className="h-28 bg-stone-700 rounded-lg flex items-center justify-center text-xs text-stone-400">
                          {send}
                        </div>
                      </CarouselItem>
                      )
                    })}
                  </CarouselContent>

                  {/* <CarouselPrevious />
                  <CarouselNext /> */}
                </Carousel>
              </div>
            </CardContent>

            {/* --- Footer --- */}
            <CardFooter className="pt-2 text-xs text-stone-500 flex justify-between">
              <span>View details</span>
            </CardFooter>
          </Card>
        );
      })}

      {/* Lazy load trigger */}
      <div ref={loaderRef} className="h-10 flex justify-center items-center text-stone-500">
        Loading more…
      </div>
    </div>
  );
}
