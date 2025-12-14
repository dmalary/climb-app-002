"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import StatCard from "@/components/ux/StatCard";
import ChartCard from "@/components/ux/ChartCard";
import ChartSection from "@/components/ux/ChartSection";

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

// chart utils
import {
  computeGradeProgression,
  computeSendRateTrend,
  computeAttemptsToSend,
  computeWeeklyVolume,
  computeAngleDistribution,
  computeAngleGradeRelationship,
  computeAngleHeatmap,
  computeCumulativeVolume
} from "@/utils/analytics";

import AngleDistributionChart from "@/components/charts/AngleDistributionDonut";
import AngleGradeChart from "@/components/charts/AngleGradeScatter";
import AttemptsToSendChart from "@/components/charts/AttemptsToSendScatter";
import CumulativeVolumeChart from "@/components/charts/CumulativeVolumeLine";
// import GradeDistributionBar from "@/components/charts/GradeDistributionBar";
import GradeProgressionChart from "@/components/charts/GradeProgressionLine";
import SendTrendChart from "@/components/charts/SendTrendLine";
// import SendAttemptBar from "@/components/charts/SendAttemptBar";
// import SessionSummaryPie from "@/components/charts/SessionSummaryPie";
import WeeklyVolumeChart from "@/components/charts/WeeklyVolumeLine";
// import AngleHeatmapChart from "@/components/charts/AngleHeatmapChart";

export default function StatsOverall({ rawAttempts, isLoading }) {
  // -------------------------
  // Parse + compute stats
  // -------------------------
  const stats = useMemo(() => {
    if (!rawAttempts || rawAttempts.length === 0) return null;

    const attempts = cleanAttempts(rawAttempts);
    const { sends } = getAttemptVsSendCounts(attempts);

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
      chartData: {
        // gradeProgression: computeGradeProgression(attempts),
        sendRateTrend: computeSendRateTrend(attempts),
        attemptsToSend: computeAttemptsToSend(attempts),
        weeklyVolume: computeWeeklyVolume(attempts),
        angleDistribution: computeAngleDistribution(attempts),
        angleGradeRelationship: computeAngleGradeRelationship(attempts),
        angleHeatmap: computeAngleHeatmap(attempts),
        cumulativeVolume: computeCumulativeVolume(attempts),
      },
    };
  }, [rawAttempts]);
// console.log('stats', stats)

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

  // add a boards item (how many boards am i climbing?)
// add pie of board distribution climbs?
  return (
    <div className="space-y-10 py-4">

      {/* -------------------- */}
      {/* Overview / Outcomes */}
      {/* -------------------- */}
      <ChartSection
        title="Overall Performance"
        description="High-level outcomes across all logged sessions."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total Sends" value={stats.totalSends} />
          <StatCard label="Send %" value={`${(stats.sendPercentage * 100).toFixed(1)}%`} />
          <StatCard label="Total Attempts" value={stats.totalAttempts} />

          <StatCard label="Unique Climbs" value={stats.uniqueClimbs} />
          <StatCard label="Benchmark Sends" value={stats.benchmarkSends} />
          <StatCard label="Repeat Sends" value={stats.repeatSends} />

          <ChartCard title="Send Rate Over Time" className="col-span-2">
            <SendTrendChart data={stats.chartData.sendRateTrend} />
          </ChartCard>
        </div>
      </ChartSection>

      {/* -------------------- */}
      {/* Volume & Consistency */}
      {/* -------------------- */}
      <ChartSection
        title="Volume & Consistency"
        description="How frequently and consistently you climb over time."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            label="Avg Attempts / Send"
            value={stats.avgAttemptsPerSend.toFixed(2)}
          />
          <StatCard label="Total Flashes" value={stats.totalFlashCount} />
          <StatCard
            label="Flash %"
            value={`${(stats.flashPercentage * 100).toFixed(1)}%`}
          />

          <ChartCard title="Weekly Volume" className="col-span-2">
            <WeeklyVolumeChart data={stats.chartData.weeklyVolume} />
          </ChartCard>

          <ChartCard title="Cumulative Volume" className="col-span-2">
            <CumulativeVolumeChart data={stats.chartData.cumulativeVolume} />
          </ChartCard>
        </div>
      </ChartSection>

      {/* -------------------- */}
      {/* Difficulty & Effort */}
      {/* -------------------- */}
      <ChartSection
        title="Difficulty & Effort"
        description="How hard you climb and how many attempts it takes."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Avg Grade" value={Math.floor(stats.avgGrade) || "–"} />
          <StatCard label="Hardest Send" value={stats.hardestSend?.grade || "–"} />
          <StatCard label="Hardest Flash" value={stats.hardestFlash?.grade || "–"} />

          <ChartCard title="Attempts to Send" className="col-span-2">
            <AttemptsToSendChart data={stats.chartData.attemptsToSend} />
          </ChartCard>
        </div>
      </ChartSection>

      {/* -------------------- */}
      {/* Angles & Style */}
      {/* -------------------- */}
      <ChartSection
        title="Angles & Style"
        description="How wall angle influences difficulty and volume."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <ChartCard title="Angle Distribution" className="col-span-2">
            <AngleDistributionChart data={stats.chartData.angleDistribution} />
          </ChartCard>

          <ChartCard title="Grade vs Angle" className="col-span-2">
            <AngleGradeChart data={stats.chartData.angleGradeRelationship} />
          </ChartCard>
        </div>
      </ChartSection>
    </div>
  );
}
