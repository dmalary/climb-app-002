import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ChartCard({ title, children }) {
  return (
    <Card className="col-span-2 rounded-2xl bg-stone-800 border-stone-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-stone-300">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[220px]">
        {children}
      </CardContent>
    </Card>
  );
}
