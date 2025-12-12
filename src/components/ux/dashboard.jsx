"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import SendAttemptBar from "@/components/charts/SendAttemptBar";
import {GradeDistributionBar} from "@/components/charts/GradeDistributionBar";
import SessionSummaryPie from "@/components/charts/SessionSummaryPie";

import { getUserSessionAttempts, getSessionAttempts } from "@/utils/db";
import { cleanAttempts, getGradeHistogram, getSessionBreakdown, getAttemptVsSendCounts } from "@/utils/analytics";

export default function Dashboard({ sessionId, token }) {
  const [attemptsVsSendsData, setAttemptsVsSendsData] = useState([]);
  const [gradeDistributionData, setGradeDistributionData] = useState([]);
  const [sessionSummaryData, setSessionSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // const rawAttempts = await getUserSessionAttempts(sessionId, token);
      const rawAttempts = await getSessionAttempts(sessionId, token);
      // console.log('rawAttempts', rawAttempts)

      if (!rawAttempts) {
        setLoading(false);
        return;
      }

      const cleaned = cleanAttempts(rawAttempts);

      // Attempts vs Sends
      const avs = getAttemptVsSendCounts(rawAttempts);
      setAttemptsVsSendsData([
        { name: "Attempts", value: avs.attempts },
        { name: "Sends", value: avs.sends },
      ]);

      // Grade distribution
      setGradeDistributionData(getGradeHistogram(cleaned));

      // Session summary pie
      const summary = getSessionBreakdown(rawAttempts);
      setSessionSummaryData([
        { name: "Flashes", value: summary.flashes },
        { name: "Sends", value: summary.sends },
        { name: "Attempts", value: summary.attempts },
      ]);

      setLoading(false);
    }

    fetchData();
  }, [sessionId, token]);

  if (loading) {
    return <div className="p-4 text-center text-white">Loading dashboard...</div>;
  }

  return (
    <div
      className="
        grid grid-cols-2 gap-4 
        md:grid-cols-4 md:auto-rows-[200px]
        p-4
      "
    >
      {/* ---------- 1×1 card (mobile: 1/2 width) ---------- */}
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>Attempts vs Sends</CardTitle>
        </CardHeader>
        <CardContent>
          <SendAttemptBar data={attemptsVsSendsData} />
        </CardContent>
      </Card>

      {/* ---------- 2×1 card (mobile full width) ---------- */}
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <GradeDistributionBar data={gradeDistributionData} />
        </CardContent>
      </Card>

      {/* ---------- 1×2 card ---------- */}
      <Card className="col-span-2 row-span-2">
        <CardHeader>
          <CardTitle>Session Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <SessionSummaryPie data={sessionSummaryData} />
        </CardContent>
      </Card>

      {/* ---------- Placeholder 2×2 card ---------- */}
      <Card className="col-span-2 row-span-2 bg-stone-800 text-white flex items-center justify-center">
        <CardContent className="text-center text-stone-400">
          2×2 Placeholder (Full width on mobile)
        </CardContent>
      </Card>

      {/* ---------- Placeholder 1×1 card ---------- */}
      <Card className="col-span-1 row-span-1 bg-stone-800 text-white flex items-center justify-center">
        <CardContent className="text-stone-400">1×1 Placeholder</CardContent>
      </Card>

      {/* ---------- Placeholder 2×1 card ---------- */}
      <Card className="col-span-2 row-span-1 bg-stone-800 text-white flex items-center justify-center">
        <CardContent className="text-stone-400">2×1 Placeholder</CardContent>
      </Card>

      {/* ---------- Placeholder 1×2 card ---------- */}
      <Card className="col-span-1 row-span-2 bg-stone-800 text-white flex items-center justify-center">
        <CardContent className="text-stone-400">1×2 Placeholder</CardContent>
      </Card>
    </div>
  );
}

