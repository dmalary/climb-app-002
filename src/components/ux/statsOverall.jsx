import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// --------------------
// Overall Stats
export default function StatsOverall() {
  return (
    <div className="grid md:grid-cols-2 gap-6 py-4">
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg">Total Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">42</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg">Total Climbs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">316</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Volume</CardTitle>
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
