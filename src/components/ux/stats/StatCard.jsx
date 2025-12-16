import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value }) {
  return (
    <Card className="rounded-2xl bg-stone-800 border-stone-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-stone-400 uppercase tracking-wider">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-stone-100">{value}</p>
      </CardContent>
    </Card>
  );
}