import { Card, CardHeader, CardContent } from "@/components/ui/card";

import ChartSection from "@/components/ux/charts/ChartSection";

import AttemptsPerClimbChart from "@/components/charts/AttemptsPerClimbChart";
import SendsVsAttemptsChart from "@/components/charts/SendsVsAttemptsChart";
import GradeMixChart from "@/components/charts/GradeMixChart";
import AngleMixChart from "@/components/charts/AngleMixChart";
import SessionTimelineChart from "@/components/charts/SessionTimelineChart";

export default function SessionChartsCard({ charts }) {
  if (!charts) return null;

  return (
    <Card className="bg-stone-800 border-none rounded-none">
      <CardHeader>
        <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
          Session Stats
        </h3>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ChartSection title="Attempts per Climb">
          <AttemptsPerClimbChart data={charts.attemptsPerClimb} />
        </ChartSection>

        <ChartSection title="Sends vs Attempts">
          <SendsVsAttemptsChart data={charts.sendsVsAttempts} />
        </ChartSection>

        <ChartSection title="Grade Mix">
          <GradeMixChart data={charts.gradeMix} />
        </ChartSection>

        <ChartSection title="Angle Mix">
          <AngleMixChart data={charts.angleMix} />
        </ChartSection>

        <ChartSection title="Session Timeline">
          <SessionTimelineChart data={charts.timeline} />
        </ChartSection>    
        {/* <ChartSection title="Micro Progression" className="sm:col-span-2" /> */}
      </CardContent>
    </Card>
  );
}
