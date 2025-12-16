import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SessionNumsCard({ session, nums }) {
  if (!nums) return null;

  return (
    <Card className="bg-stone-800 border-none rounded-none">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
          Session Overview
        </h3>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
        <Stat label="Total Attempts" value={nums.attempts} />
        <Stat label="Total Sends" value={nums.sends} />
        <Stat label="Flashes" value={nums.flashes} />

        <Stat label="Attempts / Climb" value={nums.attemptsPerClimb} />
        <Stat label="Avg Grade" value={nums.avgGrade ?? "–"} />
        <Stat label="Hardest Grade" value={nums.maxGrade ?? "–"} />

        <Stat label="Angles Climbed" value={nums.angles || "–"} />
        <Stat label="Board" value={nums.board} />
        <Stat label="Benchmark Sends" value={nums.benchmarkCount} />
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-stone-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-lg font-semibold text-stone-100">
        {value}
      </span>
    </div>
  );
}
