import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SessionSendsCarousel({ session, attempts, username }) {
  const sends = attempts.filter(a => a.isAscent);
  const [{ date }] = session;

  const sessionDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="bg-stone-800 border-none rounded-none">
      <CardHeader className="pb-3">
        <h1 className="text-xl font-semibold text-stone-100">
          {username || "User"}
        </h1>
        <p className="text-xs text-stone-400">{sessionDate}</p>
      </CardHeader>

      <CardContent>
        <Carousel>
          <CarouselContent>
            {(sends.length ? sends : [{ placeholder: true }]).map((send, i) => (
              <CarouselItem key={i} className="basis-4/5">
                <div className="h-48 bg-stone-700 rounded-lg flex items-center justify-center text-xs text-stone-400">
                  {send.placeholder
                    ? "No sends this session"
                    : `${send.grade} @ ${send.angle}° • ${send.totalTries} tries`}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}
