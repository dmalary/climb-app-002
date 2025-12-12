import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// --------------------
// Session-Level Stats
export default function StatsSession() {
  return (
    <div className="grid md:grid-cols-2 gap-6 py-4">
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg">Session Date</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">Dec 11, 2025</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg">Climbs Logged</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">14</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Intensity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56 flex items-center justify-center text-muted-foreground">
            {/* placeholder for chart */}
            <span>Chart goes here</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
