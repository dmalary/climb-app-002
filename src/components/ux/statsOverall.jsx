"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// --- Analytics utils ---
import {
  cleanAttempts,
  getFlashRate,
  getAverageGrade,
  getMaxGrade,
  getMaxFlashGrade,
  getSendPercentage,
  getTotalUniqueClimbs,
  getBenchmarkCount,
  getRepeatCount,
  getAttemptVsSendCounts,
  getAverageAttemptsPerSend,
} from "@/utils/analytics";

export default function StatsOverall({ rawAttempts, isLoading }) {
  // -------------------------
  // Parse + compute stats
  // -------------------------
  const stats = useMemo(() => {
    if (!rawAttempts || rawAttempts.length === 0) return null;

    const attempts = cleanAttempts(rawAttempts);

    const { sends, attempts: attemptsOnly } = getAttemptVsSendCounts(attempts);

    return {
      totalSends: sends,
      totalAttempts: attempts.length,
      totalFlashCount: attempts.filter(a => a.isAscent && a.tries === 1).length,
      flashPercentage: getFlashRate(attempts),

      benchmarkSends: getBenchmarkCount(attempts),
      repeatSends: getRepeatCount(attempts),

      uniqueClimbs: getTotalUniqueClimbs(attempts),

      avgAttemptsPerSend: getAverageAttemptsPerSend(attempts),
      avgGrade: getAverageGrade(attempts),

      hardestSend: getMaxGrade(attempts),
      hardestFlash: getMaxFlashGrade(attempts),

      lifetimeVolume: attempts.length,
      sendPercentage: getSendPercentage(attempts),
    };
  }, [rawAttempts]);
console.log('stats', stats)
  // -------------------------
  // Loading Skeleton
  // -------------------------
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="rounded-2xl p-4">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  // -------------------------
  // Number Cards
  // -------------------------
  const cards = [
    { label: "Total Sends", value: stats.totalSends },
    { label: "Total Attempts", value: stats.totalAttempts },
    { label: "Total Flashes", value: stats.totalFlashCount },
    { 
      label: "Flash %", 
      value: `${(stats.flashPercentage * 100).toFixed(1)}%` 
    },
    { label: "Benchmark Sends", value: stats.benchmarkSends },
    { label: "Repeat Sends", value: stats.repeatSends },
    { label: "Unique Climbs", value: stats.uniqueClimbs },
    { 
      label: "Avg Attempts / Send", 
      value: stats.avgAttemptsPerSend.toFixed(2) 
    },
    { 
      label: "Avg Grade", 
      value: stats.avgGrade || "–" 
    },
    { 
      label: "Hardest Send", 
      value: stats.hardestSend?.grade || "–" 
    },
    { 
      label: "Hardest Flash", 
      value: stats.hardestFlash?.grade || "–" 
    },
    { label: "Lifetime Volume", value: stats.lifetimeVolume },
    { 
      label: "Send %", 
      value: `${(stats.sendPercentage * 100).toFixed(1)}%` 
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
      {cards.map((c, i) => (
        <Card key={i} className="rounded-2xl bg-stone-800 border-stone-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-stone-400 uppercase tracking-wider">
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-stone-100">
              {c.value}
            </p>
          </CardContent>
        </Card>
      ))}

      {/* Optional: Add charts below */}
      {/* <div className="col-span-2 sm:col-span-3 mt-6">
        <YourVolumeChart data={weeklyVolume} />
      </div> */}
    </div>
  );
}
